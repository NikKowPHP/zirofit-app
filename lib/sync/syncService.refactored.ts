import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSyncStore } from '@/store/syncStore'
import { SyncFactory } from './factories/SyncFactory'
import { DataTransformer } from './transformers/DataTransformer'
import { SyncValidator } from './validators/SyncValidator'
import { ApiAdapter } from './adapters/ApiAdapter'
import { DatabaseAdapter } from './adapters/DatabaseAdapter'

const LAST_PULLED_AT_KEY = 'last_pulled_at'

/**
 * @deprecated Use SyncManager instead. This is the refactored version that uses atomic classes.
 * The original syncService.ts will be updated to use this implementation.
 */
export class SyncService {
  private static instance: SyncService
  private dataTransformer: DataTransformer
  private validator: SyncValidator
  private apiAdapter: ApiAdapter
  private databaseAdapter: DatabaseAdapter

  private constructor() {
    this.dataTransformer = SyncFactory.getDataTransformer()
    this.validator = SyncFactory.getSyncValidator()
    this.apiAdapter = SyncFactory.getApiAdapter()
    this.databaseAdapter = SyncFactory.getDatabaseAdapter()
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService()
    }
    return SyncService.instance
  }

  async pullChanges(): Promise<void> {
    try {
      useSyncStore.getState().setStatus('syncing')
      
      const lastPulledAt = await SyncFactory.getLastPulledAt()
      console.log('SyncService: Pulling changes, last pulled at:', lastPulledAt)

      const response = await this.apiAdapter.pullChanges(lastPulledAt ?? undefined)
      
      if (!response.success) {
        throw new Error(`Pull failed: ${response.error}`)
      }

      const { changes, timestamp } = response.data

      if (!changes) {
        console.warn('SyncService: No changes object in sync response')
        this.updateSyncStatus('idle')
        return
      }

      console.log('SyncService: Processing changes:', Object.keys(changes))

      // Process changes through database adapter
      const results = await this.databaseAdapter.processChanges(changes)
      
      // Log processing results
      results.forEach(result => {
        if (result.errors.length > 0) {
          console.error(`SyncService: Errors processing ${result.tableName}:`, result.errors)
        }
        console.log(`SyncService: ${result.tableName} - Created: ${result.created}, Updated: ${result.updated}, Deleted: ${result.deleted}`)
      })

      // Update last pulled timestamp
      if (timestamp) {
        await SyncFactory.setLastPulledAt(timestamp.toString())
      }

      // Debug: Log what we just synced
      const stats = await this.databaseAdapter.getTableStats()
      console.log('=== SYNC PULL COMPLETED ===')
      Object.entries(stats).forEach(([table, count]) => {
        console.log(`${table} count: ${count}`)
      })

      this.updateSyncStatus('idle')

    } catch (error) {
      console.error('SyncService: Error pulling changes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error'
      useSyncStore.getState().setError(errorMessage)
      throw error
    }
  }

  async pushChanges(): Promise<void> {
    try {
      useSyncStore.getState().setStatus('syncing')
      
      console.log('SyncService: Collecting local changes...')
      
      // Get all changed records through database adapter
      const tableNames = this.getSyncTableNames()
      const changes = await this.databaseAdapter.collectChanges(tableNames)

      console.log('SyncService: Changes to push:', JSON.stringify(changes, null, 2))

      if (Object.keys(changes).length === 0) {
        console.log('SyncService: No changes to push')
        this.updateSyncStatus('idle')
        return
      }

      // Validate changes before sending
      const validationResult = this.validator.validateSyncChanges(changes)
      
      if (!validationResult.isValid) {
        console.error('SyncService: Changes validation failed:', this.validator.summarizeValidation(validationResult))
        useSyncStore.getState().setError('Data validation failed before sync')
        this.updateSyncStatus('idle')
        return
      }

      console.log('SyncService: Validation summary:', this.validator.summarizeValidation(validationResult))

      // Push validated changes to backend
      const response = await this.apiAdapter.pushChanges(changes as any)
      
      if (!response.success) {
        throw new Error(`Push failed: ${response.error}`)
      }

      // Mark records as synced
      await this.databaseAdapter.markAsSynced(changes)

      this.updateSyncStatus('idle')
      console.log('=== SYNC PUSH COMPLETED ===')

    } catch (error) {
      console.error('SyncService: Error pushing changes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown push error'
      useSyncStore.getState().setError(errorMessage)
      throw error
    }
  }

  async resetSyncTimestamp(): Promise<void> {
    console.log('SyncService: Resetting sync timestamp...')
    await SyncFactory.resetSyncTimestamp()
    console.log('SyncService: Sync timestamp reset - next sync will pull all data')
  }

  /**
   * Get comprehensive sync status
   */
  async getSyncStatus(): Promise<{
    status: string
    lastSyncedAt: Date | null
    pendingChanges: number
    tableStats: Record<string, number>
    error: string | null
  }> {
    const status = useSyncStore.getState().status
    const lastSyncedAt = useSyncStore.getState().lastSyncedAt
    const error = useSyncStore.getState().error

    // Get pending changes count
    const tableNames = this.getSyncTableNames()
    const changes = await this.databaseAdapter.collectChanges(tableNames)
    const pendingChanges = Object.values(changes).reduce((total, tableChanges) => {
      return total + (tableChanges.created?.length || 0) + (tableChanges.updated?.length || 0) + (tableChanges.deleted?.length || 0)
    }, 0)

    // Get table statistics
    const tableStats = await this.databaseAdapter.getTableStats()

    return {
      status,
      lastSyncedAt,
      pendingChanges,
      tableStats,
      error
    }
  }

  /**
   * Force sync (both pull and push)
   */
  async forceSync(): Promise<void> {
    console.log('SyncService: Starting forced sync...')
    try {
      // First pull changes from server
      await this.pullChanges()
      
      // Then push local changes
      await this.pushChanges()
      
      console.log('SyncService: Force sync completed successfully')
    } catch (error) {
      console.error('SyncService: Force sync failed:', error)
      throw error
    }
  }

  /**
   * Test sync connectivity
   */
  async testSyncConnectivity(): Promise<{
    apiAvailable: boolean
    lastSyncStatus?: any
    error?: string
  }> {
    try {
      const apiAvailable = await this.apiAdapter.validateEndpoint()
      
      if (!apiAvailable) {
        return { apiAvailable: false, error: 'API endpoint not reachable' }
      }

      const statusResponse = await this.apiAdapter.checkSyncStatus()
      
      return {
        apiAvailable: true,
        lastSyncStatus: statusResponse.data
      }
    } catch (error) {
      return {
        apiAvailable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get table names that should be synced
   */
  private getSyncTableNames(): string[] {
    return [
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
  }

  /**
   * Update sync store status
   */
  private updateSyncStatus(status: 'idle' | 'syncing'): void {
    useSyncStore.getState().setLastSyncedAt(new Date())
    useSyncStore.getState().setStatus(status)
    useSyncStore.getState().setError(null)
  }
}

// Export singleton instance
export const syncService = SyncService.getInstance()