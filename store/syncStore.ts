import { create } from 'zustand'

type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error' | 'never_synced'

interface SyncState {
  status: SyncStatus
  lastSyncedAt: Date | null
  lastError: string | null
  setStatus: (status: SyncStatus) => void
  setLastSyncedAt: (date: Date) => void
  setError: (error: string) => void
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'never_synced',
  lastSyncedAt: null,
  lastError: null,
  setStatus: (status) => set({ status }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt, status: 'idle', lastError: null }),
  setError: (error) => set({ status: 'error', lastError: error }),
}))
