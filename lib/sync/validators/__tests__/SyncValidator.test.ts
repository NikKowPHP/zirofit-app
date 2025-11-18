import { SyncValidator, ValidationResult } from '../SyncValidator'

describe('SyncValidator', () => {
  let validator: SyncValidator

  beforeEach(() => {
    validator = new SyncValidator()
  })

  describe('validateSyncChanges', () => {
    it('should validate valid sync changes', () => {
      // Arrange
      const changes = {
        profiles: {
          created: [{ id: '1', userId: 'user1' }],
          updated: [{ id: '2', name: 'Updated Name' }],
          deleted: ['3', '4']
        },
        clients: {
          created: [{ id: '5', email: 'client@example.com' }]
        }
      }

      // Act
      const result = validator.validateSyncChanges(changes)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
      expect(result.data).toEqual(changes)
    })

    it('should reject invalid changes structure', () => {
      // Arrange
      const changes = null

      // Act
      const result = validator.validateSyncChanges(changes)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid changes structure - must be an object')
    })

    it('should handle empty changes', () => {
      // Arrange
      const changes = {}

      // Act
      const result = validator.validateSyncChanges(changes)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('No tables to sync')
      expect(result.data).toEqual({})
    })

    it('should validate individual table changes', () => {
      // Arrange
      const changes = {
        profiles: {
          created: [{ id: '1', userId: 'user1' }],
          updated: [{ id: '2', name: 'Updated Name' }],
          deleted: ['3', '4']
        },
        invalid_table: {
          created: 'not an array', // Invalid
          updated: [{ id: null, name: 'Invalid' }], // Invalid record
          deleted: ['5']
        }
      }

      // Act
      const result = validator.validateSyncChanges(changes)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('invalid_table: Invalid changes structure for table - must be an object')
      expect(result.data).toEqual({
        profiles: changes.profiles // Valid table should be included
      })
    })
  })

  describe('validateRecord', () => {
    it('should validate valid record', () => {
      // Arrange
      const record = {
        id: '123',
        name: 'John Doe',
        userId: 'user123'
      }

      // Act
      const result = validator.validateRecord(record, 'profiles')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
      expect(result.data).toEqual(record)
    })

    it('should reject invalid record structure', () => {
      // Arrange
      const record = 'not an object'

      // Act
      const result = validator.validateRecord(record, 'profiles')

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid record(profiles) - must be an object')
    })

    it('should reject record without id', () => {
      // Arrange
      const record = {
        name: 'John Doe',
        userId: 'user123'
      }

      // Act
      const result = validator.validateRecord(record, 'profiles')

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required id field(profiles)')
    })

    it('should reject record with invalid id type', () => {
      // Arrange
      const record = {
        id: {},
        name: 'John Doe'
      }

      // Act
      const result = validator.validateRecord(record, 'profiles')

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid id(profiles) - must be string or number')
    })

    it('should warn about missing required fields', () => {
      // Arrange
      const record = {
        id: '123',
        name: 'John Doe'
        // Missing userId for profile record
      }

      // Act
      const result = validator.validateRecord(record, 'profiles')

      // Assert
      expect(result.isValid).toBe(true) // Still valid, just warns
      expect(result.warnings).toContain('Missing field: userId(profiles)')
    })
  })

  describe('validateRecordArray', () => {
    it('should filter valid and invalid records', () => {
      // Arrange
      const records = [
        { id: '1', name: 'Valid Record' },
        null, // Invalid
        { name: 'Missing ID' }, // Invalid - no id
        { id: '2', name: 'Another Valid' },
        { id: {}, name: 'Invalid ID Type' } // Invalid - wrong id type
      ]

      // Act
      const result = (validator as any).validateRecordArray(records, 'created')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.warnings).toHaveLength(3) // Three invalid records
      expect(result.data).toEqual([
        { id: '1', name: 'Valid Record' },
        { id: '2', name: 'Another Valid' }
      ])
    })

    it('should handle empty array', () => {
      // Arrange
      const records: any[] = []

      // Act
      const result = (validator as any).validateRecordArray(records, 'created')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.warnings).toEqual([])
      expect(result.data).toEqual([])
    })
  })

  describe('validateIdArray', () => {
    it('should filter valid and invalid IDs', () => {
      // Arrange
      const ids = ['1', '2', null, '', '3', 4, {}]

      // Act
      const result = (validator as any).validateIdArray(ids, 'deleted')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.warnings).toHaveLength(3) // null, empty string, and object
      expect(result.data).toEqual(['1', '2', '3', '4'])
    })

    it('should handle empty ID array', () => {
      // Arrange
      const ids: any[] = []

      // Act
      const result = (validator as any).validateIdArray(ids, 'deleted')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.warnings).toEqual([])
      expect(result.data).toEqual([])
    })
  })

  describe('summarizeValidation', () => {
    it('should create summary for successful validation', () => {
      // Arrange
      const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        data: { profiles: { created: [{ id: '1' }] } }
      }

      // Act
      const summary = validator.summarizeValidation(result)

      // Assert
      expect(summary).toContain('✅ Validation passed')
      expect(summary).toContain('Valid tables: 1')
    })

    it('should create summary for failed validation', () => {
      // Arrange
      const result: ValidationResult = {
        isValid: false,
        errors: ['Error 1', 'Error 2'],
        warnings: ['Warning 1'],
        data: null
      }

      // Act
      const summary = validator.summarizeValidation(result)

      // Assert
      expect(summary).toContain('❌ Validation failed')
      expect(summary).toContain('Errors (2):')
      expect(summary).toContain('Warnings (1):')
    })

    it('should handle no valid changes', () => {
      // Arrange
      const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: ['No tables to sync'],
        data: null
      }

      // Act
      const summary = validator.summarizeValidation(result)

      // Assert
      expect(summary).toContain('✅ Validation passed')
      expect(summary).toContain('No tables to sync')
      expect(summary).toContain('Valid tables: 0')
    })
  })

  describe('getRequiredFieldsForRecord', () => {
    it('should identify required fields for user profile records', () => {
      // Arrange
      const record = {
        id: '1',
        userId: 'user123',
        name: 'John Doe'
      }

      // Act
      const requiredFields = (validator as any).getRequiredFieldsForRecord(record)

      // Assert
      expect(requiredFields).toContain('userId')
    })

    it('should identify required fields for client records', () => {
      // Arrange
      const record = {
        id: '1',
        clientId: 'client123',
        email: 'client@example.com'
      }

      // Act
      const requiredFields = (validator as any).getRequiredFieldsForRecord(record)

      // Assert
      expect(requiredFields).toContain('clientId')
    })

    it('should identify trainerId when present', () => {
      // Arrange
      const record = {
        id: '1',
        trainerId: 'trainer123',
        userId: 'user123'
      }

      // Act
      const requiredFields = (validator as any).getRequiredFieldsForRecord(record)

      // Assert
      expect(requiredFields).toContain('trainerId')
      expect(requiredFields).toContain('userId')
    })
  })
})