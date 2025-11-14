import AsyncStorage from '@react-native-async-storage/async-storage'
import { database } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { apiFetch } from '@/lib/api/core/apiFetch'
import Client from '@/lib/db/models/Client'
import TrainerProfile from '@/lib/db/models/TrainerProfile'
import WorkoutSession from '@/lib/db/models/WorkoutSession'
import Exercise from '@/lib/db/models/Exercise'
import WorkoutTemplate from '@/lib/db/models/WorkoutTemplate'
import ClientAssessment from '@/lib/db/models/ClientAssessment'
import ClientMeasurement from '@/lib/db/models/ClientMeasurement'
import ClientPhoto from '@/lib/db/models/ClientPhoto'
import ClientExerciseLog from '@/lib/db/models/ClientExerciseLog'
import TrainerService from '@/lib/db/models/TrainerService'
import TrainerPackage from '@/lib/db/models/TrainerPackage'
import TrainerTestimonial from '@/lib/db/models/TrainerTestimonial'
import TrainerProgram from '@/lib/db/models/TrainerProgram'
import CalendarEvent from '@/lib/db/models/CalendarEvent'
import Notification from '@/lib/db/models/Notification'
import Booking from '@/lib/db/models/Booking'
import { useSyncStore } from '@/store/syncStore'
import { Q } from '@nozbe/watermelondb'

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
        const { changes, timestamp } = data

        await database.write(async () => {
          // Process each table's changes
          await this.processChanges('clients', changes.clients)
          await this.processChanges('trainer_profiles', changes.trainer_profiles)
          await this.processChanges('workout_sessions', changes.workout_sessions)
          await this.processChanges('exercises', changes.exercises)
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

      if (Object.keys(changes).length === 0) {
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

  private async processChanges(tableName: string, changes: any): Promise<void> {
    if (!changes) return

    const collection = database.collections.get(tableName)

    // Handle created records
    if (changes.created) {
      for (const record of changes.created) {
        await collection.create(model => {
          Object.assign(model, this.transformRecordForDB(record))
          ;(model as any).sync_status = 'synced' // Mark as already synced
        })
      }
    }

    // Handle updated records
    if (changes.updated) {
      for (const record of changes.updated) {
        const existing = await collection.find(record.id).catch(() => null)
        if (existing) {
          await existing.update(model => {
            Object.assign(model, this.transformRecordForDB(record))
            ;(model as any).sync_status = 'synced' // Mark as already synced
          })
        }
      }
    }

    // Handle deleted records
    if (changes.deleted) {
      for (const id of changes.deleted) {
        const record = await collection.find(id).catch(() => null)
        if (record) {
          await record.destroyPermanently()
        }
      }
    }
  }

  private async collectChanges(): Promise<any> {
    const changes: any = {}

    // Query for records that need to be pushed (sync_status is not 'synced')
    const tables = [
      'clients',
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
        const created = changedRecords.filter(r => (r as any).sync_status === 'created').map(r => this.transformRecordForAPI(r))
        const updated = changedRecords.filter(r => (r as any).sync_status === 'updated').map(r => this.transformRecordForAPI(r))
        const deleted = changedRecords.filter(r => (r as any).sync_status === 'deleted').map(r => r.id)

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
            const record = await collection.find(recordData.id)
            await record.update((r: any) => {
              r.sync_status = 'synced'
            })
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

    // Convert timestamps
    if (record.created_at) transformed.createdAt = new Date(record.created_at)
    if (record.updated_at) transformed.updatedAt = new Date(record.updated_at)
    if (record.deleted_at) transformed.deletedAt = record.deleted_at

    // Rename fields to match DB schema
    if (record.user_id !== undefined) transformed.userId = record.user_id
    if (record.date_of_birth !== undefined) transformed.dateOfBirth = record.date_of_birth
    // ... other renames

    return transformed
  }

  private transformRecordForAPI(record: any): any {
    // Transform DB record to API format
    const transformed: any = { ...record }

    // Convert dates back
    if (record.createdAt) transformed.created_at = record.createdAt.getTime()
    if (record.updatedAt) transformed.updated_at = record.updatedAt.getTime()
    if (record.deletedAt) transformed.deleted_at = record.deletedAt

    // Rename fields back
    if (record.userId !== undefined) transformed.user_id = record.userId
    // ... other renames

    return transformed
  }
}

export const syncService = SyncService.getInstance()
