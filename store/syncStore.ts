import { create } from 'zustand'

type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error' | 'never_synced'

interface SyncState {
  status: SyncStatus
  lastSyncedAt: Date | null
  lastError: string | null
  error: string | null
  setStatus: (status: SyncStatus) => void
  setLastSyncedAt: (date: Date) => void
  setError: (error: string | null) => void
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'never_synced',
  lastSyncedAt: null,
  lastError: null,
  error: null,
  setStatus: (status) => set({ status }),
  setLastSyncedAt: (lastSyncedAt) =>
    set({
      lastSyncedAt,
      status: 'idle',
      lastError: null,
      error: null,
    }),
  setError: (error) =>
    set((state) => ({
      status: error ? 'error' : state.status,
      lastError: error,
      error,
    })),
}))
