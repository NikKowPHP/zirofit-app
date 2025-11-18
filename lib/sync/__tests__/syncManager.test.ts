import { jest } from '@jest/globals'
import { SyncManager } from '../syncManager'
import { DataTransformer } from '../transformers/DataTransformer'
import { SyncValidator } from '../validators/SyncValidator'
import { ApiAdapter } from '../adapters/ApiAdapter'
import { DatabaseAdapter } from '../adapters/DatabaseAdapter'
import { SyncFactory } from '../factories/SyncFactory'

// Mock dependencies
jest.mock('@/lib/db')
jest.mock('@/lib/api/core/apiFetch')
jest.mock('@react-native-async-storage/async-storage')
jest.mock('@/store/syncStore')

describe('SyncManager', () => {
  let syncManager: SyncManager
  let mockDataTransformer: jest.Mocked<DataTransformer>
  let mockValidator: jest.Mocked<SyncValidator>
  let mockApiAdapter: jest.Mocked<ApiAdapter>
  let mockDatabaseAdapter: jest.Mocked<DatabaseAdapter>

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Create mock instances
    mockDataTransformer = {
      transformRecordForDB: jest.fn(),
      transformRecordForAPI: jest.fn(),
    } as any

    mockValidator = {
      validateSyncChanges: jest.fn(),
      validateRecord: jest.fn(),
      summarizeValidation: jest.fn(),
    } as any

    mockApiAdapter = {
      pullChanges: jest.fn(),
      pushChanges: jest.fn(),
      checkSyncStatus: jest.fn(),
      validateEndpoint: jest.fn(),
    } as any

    mockDatabaseAdapter = {
      processChanges: jest.fn(),
      collectChanges: jest.fn(),
      markAsSynced: jest.fn(),
      getTableStats: jest.fn(),
    } as any

    // Mock factory methods
    jest.spyOn(SyncFactory, 'getDataTransformer').mockReturnValue(mockDataTransformer)
    jest.spyOn(SyncFactory, 'getSyncValidator').mockReturnValue(mockValidator)
    jest.spyOn(SyncFactory, 'getApiAdapter').mockReturnValue(mockApiAdapter)
    jest.spyOn(SyncFactory, 'getDatabaseAdapter').mockReturnValue(mockDatabaseAdapter)
    jest.spyOn(SyncFactory, 'getLastPulledAt').mockResolvedValue('1234567890')

    syncManager = SyncManager.getInstance()
  })

  describe('pullChanges', () => {
    it('should successfully pull and process changes', async () => {
      // Arrange
      const mockChanges = {
        clients: {
          created: [{ id: '1', name: 'John' }],
          updated: [],
          deleted: []
        }
      }

      mockApiAdapter.pullChanges.mockResolvedValue({
        success: true,
        data: { changes: mockChanges, timestamp: 1234567890 }
      })

      mockDatabaseAdapter.processChanges.mockResolvedValue([{
        tableName: 'clients',
        created: 1,
        updated: 0,
        deleted: 0,
        errors: []
      }])

      mockDatabaseAdapter.getTableStats.mockResolvedValue({
        clients: 1,
        profiles: 0
      })

      // Act
      await syncManager.pullChanges()

      // Assert
      expect(mockApiAdapter.pullChanges).toHaveBeenCalledWith('1234567890')
      expect(mockDatabaseAdapter.processChanges).toHaveBeenCalledWith(mockChanges)
      expect(SyncFactory.setLastPulledAt).toHaveBeenCalledWith('1234567890')
    })

    it('should handle pull failures gracefully', async () => {
      // Arrange
      mockApiAdapter.pullChanges.mockResolvedValue({
        success: false,
        error: 'Network error'
      })

      // Act & Assert
      await expect(syncManager.pullChanges()).rejects.toThrow('Pull failed: Network error')
    })

    it('should handle no changes response', async () => {
      // Arrange
      mockApiAdapter.pullChanges.mockResolvedValue({
        success: true,
        data: { changes: null }
      })

      // Act
      await syncManager.pullChanges()

      // Assert
      expect(mockDatabaseAdapter.processChanges).not.toHaveBeenCalled()
    })
  })

  describe('pushChanges', () => {
    it('should successfully push validated changes', async () => {
      // Arrange
      const mockChanges = {
        profiles: {
          created: [{ id: '1', userId: 'user1' }]
        }
      }

      const mockValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        data: mockChanges
      }

      mockDatabaseAdapter.collectChanges.mockResolvedValue(mockChanges)
      mockValidator.validateSyncChanges.mockReturnValue(mockValidationResult)
      mockValidator.summarizeValidation.mockReturnValue('✅ Validation passed')
      mockApiAdapter.pushChanges.mockResolvedValue({ success: true })
      mockDatabaseAdapter.markAsSynced.mockResolvedValue(undefined)

      // Act
      await syncManager.pushChanges()

      // Assert
      expect(mockDatabaseAdapter.collectChanges).toHaveBeenCalledWith(expect.any(Array))
      expect(mockValidator.validateSyncChanges).toHaveBeenCalledWith(mockChanges)
      expect(mockApiAdapter.pushChanges).toHaveBeenCalledWith(mockChanges)
      expect(mockDatabaseAdapter.markAsSynced).toHaveBeenCalledWith(mockChanges)
    })

    it('should skip push when no changes exist', async () => {
      // Arrange
      mockDatabaseAdapter.collectChanges.mockResolvedValue({})

      // Act
      await syncManager.pushChanges()

      // Assert
      expect(mockValidator.validateSyncChanges).not.toHaveBeenCalled()
      expect(mockApiAdapter.pushChanges).not.toHaveBeenCalled()
    })

    it('should skip push when validation fails', async () => {
      // Arrange
      const mockChanges = { profiles: { created: [{ id: '1' }] } }
      const mockValidationResult = {
        isValid: false,
        errors: ['Invalid record'],
        warnings: [],
        data: null
      }

      mockDatabaseAdapter.collectChanges.mockResolvedValue(mockChanges)
      mockValidator.validateSyncChanges.mockReturnValue(mockValidationResult)

      // Act
      await syncManager.pushChanges()

      // Assert
      expect(mockApiAdapter.pushChanges).not.toHaveBeenCalled()
    })
  })

  describe('getSyncStatus', () => {
    it('should return comprehensive sync status', async () => {
      // Arrange
      const mockChanges = {
        profiles: { created: [{ id: '1' }], updated: [], deleted: [] }
      }

      mockDatabaseAdapter.collectChanges.mockResolvedValue(mockChanges)
      mockDatabaseAdapter.getTableStats.mockResolvedValue({
        clients: 5,
        profiles: 3
      })

      // Act
      const status = await syncManager.getSyncStatus()

      // Assert
      expect(status).toEqual({
        status: expect.any(String),
        lastSyncedAt: expect.any(Date),
        pendingChanges: 1, // 1 created record
        tableStats: {
          clients: 5,
          profiles: 3
        },
        error: null
      })
    })
  })

  describe('forceSync', () => {
    it('should perform complete sync cycle', async () => {
      // Arrange
      mockApiAdapter.pullChanges.mockResolvedValue({
        success: true,
        data: { changes: {}, timestamp: 1234567890 }
      })
      mockDatabaseAdapter.collectChanges.mockResolvedValue({})
      mockDatabaseAdapter.processChanges.mockResolvedValue([])

      // Act
      await syncManager.forceSync()

      // Assert
      expect(mockApiAdapter.pullChanges).toHaveBeenCalled()
      expect(mockApiAdapter.pushChanges).toHaveBeenCalled()
    })

    it('should handle force sync failures', async () => {
      // Arrange
      mockApiAdapter.pullChanges.mockResolvedValue({
        success: false,
        error: 'Pull failed'
      })

      // Act & Assert
      await expect(syncManager.forceSync()).rejects.toThrow('Pull failed')
    })
  })

  describe('testSyncConnectivity', () => {
    it('should return true when API is available', async () => {
      // Arrange
      mockApiAdapter.validateEndpoint.mockResolvedValue(true)
      mockApiAdapter.checkSyncStatus.mockResolvedValue({
        success: true,
        data: { status: 'ok', timestamp: Date.now() }
      })

      // Act
      const result = await syncManager.testSyncConnectivity()

      // Assert
      expect(result).toEqual({
        apiAvailable: true,
        lastSyncStatus: { status: 'ok' }
      })
    })

    it('should return false when API is not available', async () => {
      // Arrange
      mockApiAdapter.validateEndpoint.mockResolvedValue(false)

      // Act
      const result = await syncManager.testSyncConnectivity()

      // Assert
      expect(result).toEqual({
        apiAvailable: false,
        error: 'API endpoint not reachable'
      })
    })
  })
})