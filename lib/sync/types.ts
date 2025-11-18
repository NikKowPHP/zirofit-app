/**
 * Sync system type definitions
 */

export interface SyncTimestamp {
  lastPulledAt: string | null
  lastPushedAt: string | null
  lastSyncedAt: Date | null
}

export interface SyncStatus {
  status: 'idle' | 'syncing' | 'error'
  lastSyncedAt: Date | null
  error: string | null
  pendingChanges: number
}

export interface SyncTableConfig {
  tableName: string
  primaryKey: string
  syncFields: string[]
  requiredFields: string[]
  uniqueFields: string[]
}

export interface SyncOperation {
  type: 'pull' | 'push' | 'reset'
  timestamp: number
  duration: number
  success: boolean
  details?: any
}

export interface SyncError {
  code: string
  message: string
  details?: any
  timestamp: number
  operation: SyncOperation | null
}

export interface SyncProgress {
  phase: 'collecting' | 'validating' | 'transmitting' | 'applying'
  current: number
  total: number
  message: string
}

export interface SyncConfig {
  batchSize: number
  retryAttempts: number
  timeout: number
  autoSync: boolean
  syncInterval: number
  tables: SyncTableConfig[]
}

export interface DatabaseRecord {
  id: string
  createdAt: number
  updatedAt: number
  syncStatus: 'synced' | 'created' | 'updated' | 'deleted'
  [key: string]: any
}

export interface ApiRecord {
  id: string
  createdAt: string | number
  updatedAt: string | number
  [key: string]: any
}

export interface TransformContext {
  tableName: string
  operation: 'pull' | 'push'
  record: any
  options?: any
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data: any
  context?: string
}

export interface SyncMetrics {
  totalRecords: number
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsDeleted: number
  errors: SyncError[]
  duration: number
  bandwidth: {
    uploaded: number
    downloaded: number
  }
}

export interface ConflictResolution {
  strategy: 'server_wins' | 'client_wins' | 'merge' | 'manual'
  fieldMapping?: Record<string, string>
  customResolver?: (server: any, client: any) => any
}

export interface SyncHook {
  beforePull?: (changes: any) => Promise<any> | any
  afterPull?: (result: any) => void
  beforePush?: (changes: any) => Promise<any> | any
  afterPush?: (result: any) => void
  onError?: (error: SyncError) => void
  onProgress?: (progress: SyncProgress) => void
}

export interface SyncSession {
  id: string
  startTime: number
  endTime?: number
  operations: SyncOperation[]
  metrics: SyncMetrics
  hooks: SyncHook
}

/**
 * Legacy type compatibility
 */
export type { ValidationResult as ValidationResults } from './validators/SyncValidator'
export type { DatabaseChanges as DatabaseChange } from './adapters/DatabaseAdapter'
export type { ProcessedChanges as ProcessedChange } from './adapters/DatabaseAdapter'