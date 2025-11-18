import { database } from '@/lib/db'
import { Q } from '@nozbe/watermelondb'
import { DataTransformer } from '../transformers/DataTransformer'

export interface DatabaseChanges {
  [tableName: string]: {
    created?: any[]
    updated?: any[]
    deleted?: string[]
  }
}

export interface ProcessedChanges {
  tableName: string
  created: number
  updated: number
  deleted: number
  errors: string[]
}

/**
 * Handles database operations for sync functionality
 */
export class DatabaseAdapter {
  private transformer: DataTransformer

  constructor() {
    this.transformer = new DataTransformer()
  }

  /**
   * Process incoming changes from backend
   */
  async processChanges(changes: DatabaseChanges): Promise<ProcessedChanges[]> {
    const results: ProcessedChanges[] = []

    console.log('Database: Starting to process table changes...')

    for (const [tableName, tableChanges] of Object.entries(changes)) {
      const result = await this.processTableChanges(tableName, tableChanges)
      results.push(result)
    }

    return results
  }

  /**
   * Process changes for a specific table
   */
  private async processTableChanges(tableName: string, changes: any): Promise<ProcessedChanges> {
    const result: ProcessedChanges = {
      tableName,
      created: 0,
      updated: 0,
      deleted: 0,
      errors: []
    }

    if (!changes) {
      console.log(`Database: No changes for table: ${tableName}`)
      return result
    }

    console.log(`Database: Processing ${tableName} changes:`, {
      created: changes.created?.length || 0,
      updated: changes.updated?.length || 0,
      deleted: changes.deleted?.length || 0
    })

    try {
      const collection = database.collections.get(tableName)

      // Handle created records
      if (changes.created) {
        console.log(`Database: Creating ${changes.created.length} records in ${tableName}`)
        result.created = await this.createRecords(collection, changes.created, tableName)
      }

      // Handle updated records
      if (changes.updated) {
        console.log(`Database: Updating ${changes.updated.length} records in ${tableName}`)
        result.updated = await this.updateRecords(collection, changes.updated, tableName)
      }

      // Handle deleted records
      if (changes.deleted) {
        console.log(`Database: Deleting ${changes.deleted.length} records from ${tableName}`)
        result.deleted = await this.deleteRecords(collection, changes.deleted)
      }

    } catch (error) {
      const errorMessage = `Error processing ${tableName}: ${error instanceof Error ? error.message : String(error)}`
      result.errors.push(errorMessage)
      console.error('Database: Process table changes error:', error)
    }

    return result
  }

  /**
   * Create new records in the database
   */
  private async createRecords(collection: any, records: any[], tableName: string): Promise<number> {
    let createdCount = 0

    for (const record of records) {
      try {
        const transformed = this.transformer.transformRecordForDB(record)
        console.log(`Database: Creating ${tableName} record:`, { id: record.id, transformedKeys: Object.keys(transformed) })

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
          console.log(`Database: Updating existing ${tableName} record instead of creating duplicate:`, { 
            existingId: existingRecord.id, 
            serverId: record.id 
          })
          await existingRecord.update((model: any) => {
            // Set properties individually, excluding read-only properties and syncStatus
            Object.keys(transformed).forEach(key => {
              if (!['id', '_raw', 'createdAt', 'updatedAt', 'syncStatus'].includes(key)) {
                ;(model as any)[key] = transformed[key]
              }
            })
            // Note: sync status is handled automatically by WatermelonDB
          })
          console.log(`Database: Successfully updated existing ${tableName} record: ${existingRecord.id} with server data`)
        } else {
          // Create new record
          await collection.create((model: any) => {
            // Set properties individually, excluding read-only properties and syncStatus
            Object.keys(transformed).forEach(key => {
              if (!['id', '_raw', 'createdAt', 'updatedAt', 'syncStatus'].includes(key)) {
                ;(model as any)[key] = transformed[key]
              }
            })
          })
          console.log(`Database: Successfully created ${tableName} record: ${record.id}`)
        }

        createdCount++
      } catch (error) {
        console.error(`Database: Error processing ${tableName} record ${record.id}:`, error)
      }
    }

    return createdCount
  }

  /**
   * Update existing records in the database
   */
  private async updateRecords(collection: any, records: any[], tableName: string): Promise<number> {
    let updatedCount = 0

    for (const record of records) {
      try {
        const existing = await collection.find(record.id).catch(() => null)
        if (existing) {
          const transformed = this.transformer.transformRecordForDB(record)
          console.log(`Database: Updating ${tableName} record:`, { id: record.id })
          await existing.update((model: any) => {
            // Set properties individually, excluding read-only properties and syncStatus
            Object.keys(transformed).forEach(key => {
              if (!['id', '_raw', 'createdAt', 'updatedAt', 'syncStatus'].includes(key)) {
                ;(model as any)[key] = transformed[key]
              }
            })
            // Note: sync status is handled automatically by WatermelonDB
          })
          console.log(`Database: Successfully updated ${tableName} record: ${record.id}`)
          updatedCount++
        } else {
          console.warn(`Database: Could not find ${tableName} record with id: ${record.id} to update`)
        }
      } catch (error) {
        console.error(`Database: Error updating ${tableName} record ${record.id}:`, error)
      }
    }

    return updatedCount
  }

  /**
   * Delete records from the database
   */
  private async deleteRecords(collection: any, recordIds: string[]): Promise<number> {
    let deletedCount = 0

    for (const id of recordIds) {
      try {
        const record = await collection.find(id).catch(() => null)
        if (record) {
          console.log(`Database: Deleting ${collection.table} record:`, { id })
          await record.destroyPermanently()
          console.log(`Database: Successfully deleted ${collection.table} record: ${id}`)
          deletedCount++
        } else {
          console.warn(`Database: Could not find ${collection.table} record with id: ${id} to delete`)
        }
      } catch (error) {
        console.error(`Database: Error deleting ${collection.table} record ${id}:`, error)
      }
    }

    return deletedCount
  }

  /**
   * Collect changed records from database for syncing
   */
  async collectChanges(tableNames: string[]): Promise<DatabaseChanges> {
    const changes: DatabaseChanges = {}

    for (const tableName of tableNames) {
      try {
        if (!tableName) {
          console.warn('Database: collectChanges encountered invalid table name', { tableName, tableNames })
          continue
        }

        console.log(`Database: Collecting changes for table: ${tableName}`)

        const collection = database.collections.get(tableName)
        const changedRecords = await collection.query(
          Q.where('sync_status', Q.notEq('synced'))
        ).fetch()

        if (changedRecords.length > 0) {
          const created = changedRecords.filter(r => r.syncStatus === 'created').map(r => 
            this.transformer.transformRecordForAPI(r, { tableName })
          )
          const updated = changedRecords.filter(r => r.syncStatus === 'updated').map(r => 
            this.transformer.transformRecordForAPI(r, { tableName })
          )
          const deleted = changedRecords.filter(r => r.syncStatus === 'deleted').map(r => r.id)

          changes[tableName] = { created, updated, deleted }

          console.log('Database: Pending changes summary', {
            tableName,
            total: changedRecords.length,
            created: created.length,
            updated: updated.length,
            deleted: deleted.length
          })
        } else {
          console.log(`Database: No pending changes for table: ${tableName}`)
        }
      } catch (error) {
        console.error(`Database: Error collecting changes for ${tableName}:`, error)
      }
    }

    return changes
  }

  /**
   * Mark records as synced
   */
  async markAsSynced(changes: DatabaseChanges): Promise<void> {
    await database.write(async () => {
      for (const [tableName, tableChanges] of Object.entries(changes)) {
        try {
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
                await record.update((r) => {
                  // Note: sync status is handled automatically by WatermelonDB
                })
              } else {
                console.warn(`Database: Could not find record to mark as synced: ${recordData.id} in ${tableName}`)
              }
            } catch (error) {
              console.warn(`Database: Could not find record ${recordData.id} in ${tableName} to mark as synced`)
            }
          }

          // Note: deleted records are already marked as 'deleted' status when soft deleted
        } catch (error) {
          console.error(`Database: Error marking synced records for ${tableName}:`, error)
        }
      }
    })
  }

  /**
   * Get table statistics for debugging
   */
  async getTableStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {}

    // Define all tables we want to track
    const tables = [
      'clients', 'profiles', 'trainer_profiles', 'workout_sessions', 'exercises',
      'workout_templates', 'client_assessments', 'client_measurements', 'client_photos',
      'client_exercise_logs', 'trainer_services', 'trainer_packages', 'trainer_testimonials',
      'trainer_programs', 'calendar_events', 'notifications', 'bookings'
    ]

    for (const tableName of tables) {
      try {
        const collection = database.collections.get(tableName)
        const count = await collection.query().fetchCount()
        stats[tableName] = count
      } catch (error) {
        console.warn(`Database: Error getting stats for ${tableName}:`, error)
        stats[tableName] = 0
      }
    }

    return stats
  }
}