import NetInfo from '@react-native-community/netinfo'
import { syncService } from './syncService'
import { AppState } from 'react-native'
import { useSyncStore } from '@/store/syncStore'

class SyncManager {
  private static instance: SyncManager
  private isOnline = false
  private syncInProgress = false

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager()
    }
    return SyncManager.instance
  }

  initialize() {
    // Listen for network changes
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline
      this.isOnline = state.isConnected ?? false

      if (this.isOnline) {
        useSyncStore.getState().setStatus('idle')
        if (wasOffline) {
          this.performSync()
        }
      } else {
        useSyncStore.getState().setStatus('offline')
      }
    })

    // Listen for app state changes
    AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && this.isOnline) {
        this.performSync()
      }
    })

    // Initial sync
    this.performSync()
  }

  async performSync() {
    if (!this.isOnline || this.syncInProgress) return

    this.syncInProgress = true
    try {
      await syncService.pullChanges()
      await syncService.pushChanges()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  async forceSync() {
    await this.performSync()
  }
}

export const syncManager = SyncManager.getInstance()
