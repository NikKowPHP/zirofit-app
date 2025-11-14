import { create } from 'zustand'

type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error'

interface SyncState {
  status: SyncStatus
  lastSyncedAt: Date | null
  setStatus: (status: SyncStatus) => void
  setLastSyncedAt: (date: Date) => void
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  setStatus: (status) => set({ status }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
}))
