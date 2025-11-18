import { DataTransformer } from '../transformers/DataTransformer'
import { SyncValidator } from '../validators/SyncValidator'
import { ApiAdapter } from '../adapters/ApiAdapter'
import { DatabaseAdapter } from '../adapters/DatabaseAdapter'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const LAST_PULLED_AT_KEY = 'last_pulled_at'

/**
 * Factory class for creating sync-related components
 */
export class SyncFactory {
  private static instances: Map<string, any> = new Map()

  /**
   * Get or create a DataTransformer instance
   */
  static getDataTransformer(): DataTransformer {
    const key = 'dataTransformer'
    if (!this.instances.has(key)) {
      this.instances.set(key, new DataTransformer())
    }
    return this.instances.get(key)
  }

  /**
   * Get or create a SyncValidator instance
   */
  static getSyncValidator(): SyncValidator {
    const key = 'syncValidator'
    if (!this.instances.has(key)) {
      this.instances.set(key, new SyncValidator())
    }
    return this.instances.get(key)
  }

  /**
   * Get or create an ApiAdapter instance
   */
  static getApiAdapter(): ApiAdapter {
    const key = 'apiAdapter'
    if (!this.instances.has(key)) {
      this.instances.set(key, new ApiAdapter())
    }
    return this.instances.get(key)
  }

  /**
   * Get or create a DatabaseAdapter instance
   */
  static getDatabaseAdapter(): DatabaseAdapter {
    const key = 'databaseAdapter'
    if (!this.instances.has(key)) {
      this.instances.set(key, new DatabaseAdapter())
    }
    return this.instances.get(key)
  }

  /**
   * Clear all cached instances (useful for testing)
   */
  static clearInstances(): void {
    this.instances.clear()
  }

  /**
   * Get the last pulled timestamp from storage
   */
  static async getLastPulledAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(LAST_PULLED_AT_KEY)
    } catch (error) {
      console.warn('SyncFactory: Error reading last pulled timestamp:', error)
      return null
    }
  }

  /**
   * Set the last pulled timestamp in storage
   */
  static async setLastPulledAt(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(LAST_PULLED_AT_KEY, timestamp)
    } catch (error) {
      console.warn('SyncFactory: Error saving last pulled timestamp:', error)
    }
  }

  /**
   * Reset the sync timestamp
   */
  static async resetSyncTimestamp(): Promise<void> {
    console.log('SyncFactory: Resetting sync timestamp...')
    try {
      await AsyncStorage.removeItem(LAST_PULLED_AT_KEY)
      console.log('SyncFactory: Sync timestamp reset - next sync will pull all data')
    } catch (error) {
      console.error('SyncFactory: Error resetting sync timestamp:', error)
      throw error
    }
  }

  /**
   * Create a singleton instance of the main sync service
   */
  static createSyncService(): any {
    // This will be implemented when we create the refactored sync service
    // For now, return null to indicate it needs to be implemented
    return null
  }
}