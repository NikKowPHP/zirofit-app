# Sync System Refactoring Documentation

## Overview

The sync system has been refactored using **Separation of Concerns (SoC)** principles to improve maintainability, testability, and reliability. The monolithic `SyncService` has been broken down into focused, atomic classes each responsible for a specific aspect of the sync functionality.

## Architecture

### Before (Monolithic)
```
SyncService (2000+ lines)
├── Data Transformation
├── Validation
├── API Communication
├── Database Operations
├── Error Handling
└── State Management
```

### After (Atomic Classes)
```
SyncManager (Coordinator)
├── DataTransformer (transformers/DataTransformer.ts)
├── SyncValidator (validators/SyncValidator.ts)
├── ApiAdapter (adapters/ApiAdapter.ts)
├── DatabaseAdapter (adapters/DatabaseAdapter.ts)
└── SyncFactory (factories/SyncFactory.ts)
```

## Atomic Classes

### 1. DataTransformer (`transformers/DataTransformer.ts`)

**Responsibility**: Handle data transformation between WatermelonDB and API formats.

**Key Features**:
- Transform API records to WatermelonDB format
- Transform WatermelonDB records to API format
- Handle special cases (e.g., client_measurements)
- CamelCase conversion
- Fallback transformations for edge cases

**Methods**:
- `transformRecordForDB(record)`: API → DB format
- `transformRecordForAPI(record, options)`: DB → API format
- `transformClientMeasurements()`: Special handling for measurements

### 2. SyncValidator (`validators/SyncValidator.ts`)

**Responsibility**: Validate sync data before sending to backend.

**Key Features**:
- Validate sync changes structure
- Validate individual records
- Validate table-specific requirements
- Comprehensive error reporting
- Validation summaries for debugging

**Methods**:
- `validateSyncChanges(changes)`: Validate all changes
- `validateTableChanges(tableName, changes)`: Validate table changes
- `validateRecord(record, context)`: Validate individual record
- `summarizeValidation(result)`: Create validation summary

### 3. ApiAdapter (`adapters/ApiAdapter.ts`)

**Responsibility**: Handle communication with backend sync API.

**Key Features**:
- Pull changes from backend
- Push changes to backend
- API endpoint validation
- Error handling and retry logic
- Request/response logging

**Methods**:
- `pullChanges(lastPulledAt)`: Pull changes from server
- `pushChanges(changes)`: Push changes to server
- `checkSyncStatus()`: Check sync status
- `validateEndpoint()`: Validate API connectivity

### 4. DatabaseAdapter (`adapters/DatabaseAdapter.ts`)

**Responsibility**: Handle all database operations for sync.

**Key Features**:
- Process incoming changes
- Collect local changes
- Handle conflicts (e.g., duplicate clients by email)
- Mark records as synced
- Database statistics

**Methods**:
- `processChanges(changes)`: Process backend changes
- `collectChanges(tableNames)`: Collect local changes
- `markAsSynced(changes)`: Mark records as synced
- `getTableStats()`: Get database statistics

### 5. SyncFactory (`factories/SyncFactory.ts`)

**Responsibility**: Manage component instantiation and shared resources.

**Key Features**:
- Singleton pattern for components
- Shared configuration
- AsyncStorage operations
- Instance caching

**Methods**:
- `getDataTransformer()`: Get DataTransformer instance
- `getSyncValidator()`: Get SyncValidator instance
- `getApiAdapter()`: Get ApiAdapter instance
- `getDatabaseAdapter()`: Get DatabaseAdapter instance

## Main Coordinator

### SyncManager (`syncManager.ts`)

**Responsibility**: Coordinate between atomic classes and manage sync workflow.

**Key Features**:
- Orchestrate sync operations
- Error handling and status management
- Sync statistics and monitoring
- Multiple sync strategies (pull, push, force sync)

**Methods**:
- `pullChanges()`: Pull changes from backend
- `pushChanges()`: Push local changes
- `forceSync()`: Complete sync cycle
- `getSyncStatus()`: Get comprehensive status
- `testSyncConnectivity()`: Test API connectivity

## Benefits

### 1. **Testability**
- Each class can be unit tested independently
- Mock dependencies easily
- Isolated testing of specific functionality

### 2. **Maintainability**
- Clear separation of concerns
- Easier to understand and modify
- Reduced complexity in each class

### 3. **Reusability**
- Components can be reused in other contexts
- Shared validation logic
- Reusable data transformation

### 4. **Error Handling**
- Specific error handling in each component
- Better error reporting and debugging
- Isolated failures don't affect other components

### 5. **Performance**
- Only load required components
- Efficient caching through factory
- Optimized data flow

## Migration Guide

### For Existing Code

**Before**:
```typescript
import { syncService } from '@/lib/sync/syncService'
await syncService.pushChanges()
```

**After**:
```typescript
import { syncManager } from '@/lib/sync'
await syncManager.pushChanges()
```

### For New Code

```typescript
import { syncManager, DataTransformer, SyncValidator } from '@/lib/sync'

// Use the main coordinator
await syncManager.pullChanges()

// Or use specific components
const transformer = new DataTransformer()
const validator = new SyncValidator()
```

## Error Handling Improvements

### Previous Issues Fixed
1. **Undefined modelName**: Now validated before sending
2. **Data transformation errors**: Isolated and handled in DataTransformer
3. **API communication failures**: Handled in ApiAdapter with retries
4. **Database conflicts**: Handled in DatabaseAdapter with proper conflict resolution

### New Error Handling
- Comprehensive validation before API calls
- Better error messages and debugging info
- Graceful degradation when components fail
- Detailed error reporting in sync status

## Testing Strategy

### Unit Tests
- Each atomic class should have its own test suite
- Mock dependencies to test isolation
- Test edge cases and error conditions

### Integration Tests
- Test coordination between components
- Test complete sync workflows
- Test error recovery scenarios

### End-to-End Tests
- Test real sync scenarios
- Test with actual backend API
- Test performance under load

## Future Enhancements

### Planned Features
1. **Background Sync**: Automatic sync in background
2. **Conflict Resolution**: Smart conflict resolution strategies
3. **Batch Processing**: Handle large datasets efficiently
4. **Offline Support**: Better offline-first sync
5. **Progress Tracking**: Real-time sync progress
6. **Metrics Collection**: Sync performance metrics

### Extensibility
- Easy to add new table types
- Plugin system for custom transformations
- Custom validation rules
- Multiple backend support

## Usage Examples

### Basic Sync
```typescript
import { syncManager } from '@/lib/sync'

// Pull changes
await syncManager.pullChanges()

// Push local changes
await syncManager.pushChanges()

// Complete sync cycle
await syncManager.forceSync()
```

### Advanced Usage
```typescript
import { syncManager } from '@/lib/sync'

// Check sync status
const status = await syncManager.getSyncStatus()
console.log('Pending changes:', status.pendingChanges)

// Test connectivity
const connectivity = await syncManager.testSyncConnectivity()
console.log('API available:', connectivity.apiAvailable)

// Reset sync state
await syncManager.resetSyncTimestamp()
```

### Custom Components
```typescript
import { DataTransformer, SyncValidator } from '@/lib/sync'

// Use specific components
const transformer = new DataTransformer()
const validator = new SyncValidator()

const apiRecord = transformer.transformRecordForAPI(record, { tableName: 'clients' })
const validationResult = validator.validateRecord(apiRecord)
```

## Conclusion

The refactored sync system provides a robust, maintainable, and extensible foundation for data synchronization. The atomic class architecture ensures that each component has a single responsibility, making the system easier to understand, test, and modify.

The separation of concerns allows for:
- Better error isolation and handling
- Easier testing and debugging
- More flexible architecture for future enhancements
- Improved code quality and maintainability