import { syncManager as syncManagerInstance } from './syncManager'

// Main sync components
export { SyncManager, syncManager } from './syncManager'
export { SyncService, syncService } from './syncService'

// Atomic classes
export { DataTransformer } from './transformers/DataTransformer'
export { SyncValidator, type ValidationResult, type SyncChanges } from './validators/SyncValidator'
export { ApiAdapter } from './adapters/ApiAdapter'
export { DatabaseAdapter, type DatabaseChanges, type ProcessedChanges } from './adapters/DatabaseAdapter'
export { SyncFactory, LAST_PULLED_AT_KEY } from './factories/SyncFactory'

// Type definitions
export * from './types'

/**
 * @deprecated Use SyncManager instead
 */
export const sync = syncManagerInstance