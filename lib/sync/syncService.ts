import { apiFetch } from '@/lib/api/core/apiFetch'
import { database } from '@/lib/db'
import { useSyncStore } from '@/store/syncStore'
import { Q } from '@nozbe/watermelondb'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LAST_PULLED_AT_KEY = 'last_pulled_at'

export class SyncService {
  private static instance: SyncService

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService()
    }
    return SyncService.instance
  }

  async pullChanges(): Promise<void> {
    try {
      useSyncStore.getState().setStatus('syncing')
      const lastPulledAt = await AsyncStorage.getItem(LAST_PULLED_AT_KEY)

      const params: Record<string, any> = {}
      if (lastPulledAt) {
        params.last_pulled_at = lastPulledAt
      }

      const data = await apiFetch('/sync/pull', {
        method: 'GET',
        params
      })

      if (data) {
        console.log('Sync pull response:', JSON.stringify(data, null, 2))
        const { changes, timestamp } = data.data || data

        if (!changes) {
          console.warn('No changes object in sync response')
          useSyncStore.getState().setLastSyncedAt(new Date())
          useSyncStore.getState().setStatus('idle')
          return
        }

        console.log('Processing changes:', Object.keys(changes))

        await database.write(async () => {
          console.log('Starting to process table changes...')

          await this.processChanges('clients', changes.clients)
          console.log('Processed clients')

          await this.processChanges('profiles', changes.profiles)
          console.log('Processed profiles')

          await this.processChanges('trainer_profiles', changes.trainer_profiles)
          console.log('Processed trainer_profiles')

          await this.processChanges('workout_sessions', changes.workout_sessions)
          console.log('Processed workout_sessions')

          await this.processChanges('exercises', changes.exercises)
          console.log('Processed exercises')

          await this.processChanges('workout_templates', changes.workout_templates)
          await this.processChanges('client_assessments', changes.client_assessments)
          await this.processChanges('client_measurements', changes.client_measurements)
          await this.processChanges('client_photos', changes.client_photos)
          await this.processChanges('client_exercise_logs', changes.client_exercise_logs)
          await this.processChanges('trainer_services', changes.trainer_services)
          await this.processChanges('trainer_packages', changes.trainer_packages)
          await this.processChanges('trainer_testimonials', changes.trainer_testimonials)
          await this.processChanges('trainer_programs', changes.trainer_programs)
          await this.processChanges('calendar_events', changes.calendar_events)
          await this.processChanges('notifications', changes.notifications)
          await this.processChanges('bookings', changes.bookings)
        })

        // Update last pulled timestamp
        await AsyncStorage.setItem(LAST_PULLED_AT_KEY, timestamp.toString())
        useSyncStore.getState().setLastSyncedAt(new Date())
        useSyncStore.getState().setStatus('idle')

        // Debug: Log what we just synced
        console.log('=== SYNC COMPLETED ===')
        console.log('Trainer profiles count:', (await database.collections.get('trainer_profiles').query().fetch()).length)
        console.log('Exercises count:', (await database.collections.get('exercises').query().fetch()).length)
        console.log('Clients count:', (await database.collections.get('clients').query().fetch()).length)
      }
    } catch (error) {
      console.error('Error pulling changes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error'
      useSyncStore.getState().setError(errorMessage)
      throw error
    }
  }

  async pushChanges(): Promise<void> {
    try {
      useSyncStore.getState().setStatus('syncing')
      // Get all changed records
      const changes = await this.collectChanges()

      console.log('Changes to push:', JSON.stringify(changes, null, 2))

      if (Object.keys(changes).length === 0) {
        console.log('No changes to push')
        useSyncStore.getState().setStatus('idle')
        return // Nothing to push
      }

      const data = await apiFetch('/sync/push', {
        method: 'POST',
        body: JSON.stringify({ changes })
      })

      if (data) {
        // Mark pushed records as synced
        await this.markAsSynced(changes)
        useSyncStore.getState().setLastSyncedAt(new Date())
        useSyncStore.getState().setStatus('idle')
      } else {
        useSyncStore.getState().setError('Push failed - no response')
        throw new Error('Push failed')
      }
    } catch (error) {
      console.error('Error pushing changes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown push error'
      useSyncStore.getState().setError(errorMessage)
      throw error
    }
  }

  async resetSyncTimestamp(): Promise<void> {
    console.log('Resetting sync timestamp...')
    await AsyncStorage.removeItem(LAST_PULLED_AT_KEY)
    console.log('Sync timestamp reset - next sync will pull all data')
  }

  private async processChanges(tableName: string, changes: any): Promise<void> {
    if (!changes) {
      console.log(`No changes for table: ${tableName}`)
      return
    }

    console.log(`Processing ${tableName} changes:`, {
      created: changes.created?.length || 0,
      updated: changes.updated?.length || 0,
      deleted: changes.deleted?.length || 0
    })

    const collection = database.collections.get(tableName)

    // Handle created records
    if (changes.created) {
      console.log(`Creating ${changes.created.length} records in ${tableName}`)
      for (const record of changes.created) {
        try {
          const transformed = this.transformRecordForDB(record)
          console.log(`Creating ${tableName} record:`, { id: record.id, transformedKeys: Object.keys(transformed) })

          // Check for existing record with same unique fields to handle sync conflicts
          let existingRecord = null
          if (tableName === 'clients' && record.email) {
            // For clients, check by email (unique field)
            existingRecord = await collection.query(
              Q.where('email', record.email)
            ).fetch().catch(() => [])
            existingRecord = existingRecord.length > 0 ? existingRecord[0] : null
          }

          if (existingRecord) {
            // Update existing record with server data instead of creating duplicate
            console.log(`Updating existing ${tableName} record instead of creating duplicate:`, { existingId: existingRecord.id, serverId: record.id })
            await existingRecord.update(model => {
              // Set properties individually, excluding read-only properties and syncStatus
              Object.keys(transformed).forEach(key => {
                if (!['id', '_raw', 'createdAt', 'updatedAt', 'syncStatus'].includes(key)) {
                  ;(model as any)[key] = transformed[key]
                }
              })
              ;(model as any).syncStatus = 'synced' // Mark as already synced
            })
            console.log(`Successfully updated existing ${tableName} record: ${existingRecord.id} with server data`)
          } else {
            // Create new record
            await collection.create(model => {
              // Set properties individually, excluding read-only properties and syncStatus
              Object.keys(transformed).forEach(key => {
                if (!['id', '_raw', 'createdAt', 'updatedAt', 'syncStatus'].includes(key)) {
                  ;(model as any)[key] = transformed[key]
                }
              })
            })
            console.log(`Successfully created ${tableName} record: ${record.id}`)
          }
        } catch (error) {
          console.error(`Error processing ${tableName} record ${record.id}:`, error)
        }
      }
    }

    // Handle updated records
    if (changes.updated) {
      console.log(`Updating ${changes.updated.length} records in ${tableName}`)
      for (const record of changes.updated) {
        try {
          const existing = await collection.find(record.id).catch(() => null)
          if (existing) {
            const transformed = this.transformRecordForDB(record)
            console.log(`Updating ${tableName} record:`, { id: record.id })
            await existing.update(model => {
              // Set properties individually, excluding read-only properties and syncStatus
              Object.keys(transformed).forEach(key => {
                if (!['id', '_raw', 'createdAt', 'updatedAt', 'syncStatus'].includes(key)) {
                  ;(model as any)[key] = transformed[key]
                }
              })
              ;(model as any).syncStatus = 'synced' // Mark as already synced
            })
            console.log(`Successfully updated ${tableName} record: ${record.id}`)
          } else {
            console.warn(`Could not find ${tableName} record with id: ${record.id} to update`)
          }
        } catch (error) {
          console.error(`Error updating ${tableName} record ${record.id}:`, error)
        }
      }
    }

    // Handle deleted records
    if (changes.deleted) {
      console.log(`Deleting ${changes.deleted.length} records from ${tableName}`)
      for (const id of changes.deleted) {
        try {
          const record = await collection.find(id).catch(() => null)
          if (record) {
            console.log(`Deleting ${tableName} record:`, { id })
            await record.destroyPermanently()
            console.log(`Successfully deleted ${tableName} record: ${id}`)
          } else {
            console.warn(`Could not find ${tableName} record with id: ${id} to delete`)
          }
        } catch (error) {
          console.error(`Error deleting ${tableName} record ${id}:`, error)
        }
      }
    }
  }

  private async collectChanges(): Promise<any> {
    const changes: any = {}

    // Query for records that need to be pushed (sync_status is not 'synced')
    const tables = [
      'clients',
      'profiles',
      'trainer_profiles',
      'workout_sessions',
      'exercises',
      'workout_templates',
      'client_assessments',
      'client_measurements',
      'client_photos',
      'client_exercise_logs',
      'trainer_services',
      'trainer_packages',
      'trainer_testimonials',
      'trainer_programs',
      'calendar_events',
      'notifications',
      'bookings'
    ]

    for (const tableName of tables) {
      const collection = database.collections.get(tableName)
      const changedRecords = await collection.query(
        Q.where('sync_status', Q.notEq('synced'))
      ).fetch()

      if (changedRecords.length > 0) {
        const created = changedRecords.filter(r => r.syncStatus === 'created').map(r => this.transformRecordForAPI(r))
        const updated = changedRecords.filter(r => r.syncStatus === 'updated').map(r => this.transformRecordForAPI(r))
        const deleted = changedRecords.filter(r => r.syncStatus === 'deleted').map(r => r.id)

        changes[tableName] = { created, updated, deleted }
      }
    }

    return changes
  }

  private async markAsSynced(changes: any): Promise<void> {
    await database.write(async () => {
      for (const [tableName, tableChanges] of Object.entries(changes) as [string, any][]) {
        const collection = database.collections.get(tableName)

        // Mark created and updated records as synced
        const recordsToMark = [...(tableChanges.created || []), ...(tableChanges.updated || [])]
        for (const recordData of recordsToMark) {
          try {
            // First try to find by the returned ID
            let record = await collection.find(recordData.id).catch(() => null)

            // If not found by ID, try to find by unique fields (for created records that got new server IDs)
            if (!record && tableName === 'clients' && recordData.email) {
              const existingRecords = await collection.query(
                Q.where('email', recordData.email)
              ).fetch().catch(() => [])
              record = existingRecords.length > 0 ? existingRecords[0] : null
            }

            if (record) {
              await record.update((r: any) => {
                r.syncStatus = 'synced'
              })
            } else {
              console.warn(`Could not find record to mark as synced: ${recordData.id} in ${tableName}`)
            }
          } catch (error) {
            console.warn(`Could not find record ${recordData.id} in ${tableName} to mark as synced`)
          }
        }

        // Note: deleted records are already marked as 'deleted' status when soft deleted
      }
    })
  }

  private transformRecordForDB(record: any): any {
    // Transform API record to DB format
    const transformed: any = { ...record }

    // Remove id since it's auto-generated for new records
    delete transformed.id

    // Keep timestamps as numbers (WatermelonDB stores them as numbers)
    if (record.created_at) transformed.createdAt = record.created_at
    if (record.updated_at) transformed.updatedAt = record.updated_at
    if (record.deleted_at) transformed.deletedAt = record.deleted_at

    // Rename fields to match DB schema
    if (record.user_id !== undefined) transformed.userId = record.user_id
    if (record.date_of_birth !== undefined) transformed.dateOfBirth = record.date_of_birth
    // ... other renames

    return transformed
  }

  private transformRecordForAPI(record: any): any {
    // Helper function to convert snake_case to camelCase
    const toCamelCase = (str: string): string => {
      return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    }

    // Use _raw as the primary source - it contains actual database values without circular references
    const rawRecord = record._raw || {}
    
    // Properties to exclude (WatermelonDB internals)
    const excludeProps = new Set([
      '_status',
      '_changed',
      'sync_status', // We don't want to send sync status to the server
    ])

    const transformed: any = {
      id: record.id || rawRecord.id,
    }

    // Extract all fields from _raw (these are the actual database values)
    // _raw contains snake_case keys, but API expects camelCase
    for (const key of Object.keys(rawRecord)) {
      // Skip excluded properties
      if (excludeProps.has(key)) {
        continue
      }

      const value = rawRecord[key]
      
      // Skip undefined and null values (but allow 0, false, empty string)
      if (value === undefined || value === null) {
        continue
      }

      // Skip if it's the id (already set)
      if (key === 'id') {
        continue
      }

      // Only include primitive values and simple serializable types
      const valueType = typeof value
      if (
        valueType === 'string' ||
        valueType === 'number' ||
        valueType === 'boolean' ||
        value === null
      ) {
        // Convert snake_case to camelCase for API
        const camelKey = toCamelCase(key)
        transformed[camelKey] = value
      } else if (Array.isArray(value)) {
        // For arrays, try to serialize if they contain primitives
        // Skip if they contain objects (likely relations)
        if (value.length === 0 || (typeof value[0] !== 'object' && value[0] !== null)) {
          const camelKey = toCamelCase(key)
          transformed[camelKey] = value
        }
      }
      // Skip objects, functions, and other complex types that might have circular references
    }

    // Also check model properties for fields that might not be in _raw yet
    // This is important for fields like trainerId that are required by the API
    const modelProps = ['trainerId', 'userId']
    for (const prop of modelProps) {
      if (!transformed[prop] && record[prop] !== undefined && record[prop] !== null) {
        transformed[prop] = record[prop]
      }
    }

    return transformed
  }
}

export const syncService = SyncService.getInstance()
