import { DataTransformer, TransformOptions } from '../DataTransformer'

describe('DataTransformer', () => {
  let transformer: DataTransformer

  beforeEach(() => {
    transformer = new DataTransformer()
  })

  describe('transformRecordForDB', () => {
    it('should transform API record to DB format', () => {
      // Arrange
      const apiRecord = {
        id: '123',
        user_id: 'user123',
        date_of_birth: '1990-01-01',
        created_at: 1234567890,
        updated_at: 1234567891,
        name: 'John Doe'
      }

      // Act
      const result = transformer.transformRecordForDB(apiRecord)

      // Assert
      expect(result).toEqual({
        user_id: undefined, // Should be renamed
        userId: 'user123', // Renamed field
        dateOfBirth: '1990-01-01', // Renamed field
        createdAt: 1234567890, // Kept as number
        updatedAt: 1234567891, // Kept as number
        name: 'John Doe', // Unchanged
        id: undefined // Should be removed
      })
    })

    it('should handle record without optional fields', () => {
      // Arrange
      const apiRecord = {
        id: '123',
        name: 'John Doe',
        created_at: 1234567890
      }

      // Act
      const result = transformer.transformRecordForDB(apiRecord)

      // Assert
      expect(result).toEqual({
        name: 'John Doe',
        createdAt: 1234567890,
        id: undefined
      })
    })
  })

  describe('transformRecordForAPI', () => {
    it('should transform DB record to API format with table name', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          user_id: 'user123',
          created_at: 1234567890,
          name: 'John Doe',
          email: 'john@example.com'
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'profiles' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result).toEqual({
        id: '123',
        userId: 'user123', // snake_case to camelCase
        name: 'John Doe',
        email: 'john@example.com'
      })
    })

    it('should handle fallback transformation when table name is missing', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          user_id: 'user123',
          name: 'John Doe'
        },
        userId: 'user123',
        syncStatus: 'created'
      }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord)

      // Assert
      expect(result).toEqual({
        id: '123',
        userId: 'user123'
      })
    })

    it('should transform client measurements correctly', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          measurement_type: 'weight',
          value: 80.5,
          unit: 'kg',
          measured_at: 1234567890,
          notes: 'Weekly checkup',
          client_id: 'client123'
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'client_measurements' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result).toEqual({
        id: '123',
        clientId: 'client123',
        measurementDate: '2009-02-13', // ISO date string
        notes: 'Weekly checkup',
        weightKg: 80.5,
        bodyFatPercentage: null
      })
    })

    it('should convert weight from lbs to kg', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          measurement_type: 'weight',
          value: 176.37, // ~80 kg in lbs
          unit: 'lbs',
          measured_at: 1234567890,
          client_id: 'client123'
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'client_measurements' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result.weightKg).toBeCloseTo(80, 0) // Should convert to ~80 kg
      expect(result.bodyFatPercentage).toBeNull()
    })

    it('should handle body fat measurements', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          measurement_type: 'body_fat',
          value: 15.5,
          measured_at: 1234567890,
          client_id: 'client123'
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'client_measurements' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result).toEqual({
        id: '123',
        clientId: 'client123',
        measurementDate: '2009-02-13',
        notes: null,
        weightKg: null,
        bodyFatPercentage: 15.5
      })
    })

    it('should handle custom measurements', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          measurement_type: 'arm_circumference',
          value: 32.5,
          unit: 'cm',
          measured_at: 1234567890,
          client_id: 'client123'
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'client_measurements' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result.weightKg).toBeNull()
      expect(result.bodyFatPercentage).toBeNull()
      expect(result.customMetrics).toBe(JSON.stringify([{
        name: 'arm_circumference',
        value: '32.5',
        unit: 'cm'
      }]))
    })

    it('should filter out WatermelonDB internal properties', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          name: 'John Doe',
          _status: 'created',
          _changed: 'name',
          sync_status: 'created',
          _table: 'profiles',
          email: 'john@example.com'
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'profiles' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      })
      expect(result._status).toBeUndefined()
      expect(result._changed).toBeUndefined()
      expect(result.sync_status).toBeUndefined()
      expect(result._table).toBeUndefined()
    })

    it('should handle array values correctly', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          tags: ['fitness', 'training'],
          empty_array: [],
          primitive_array: [1, 2, 3],
          object_array: [{ name: 'test' }] // Should be filtered out
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'profiles' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result).toEqual({
        id: '123',
        tags: ['fitness', 'training'],
        empty_array: [],
        primitive_array: [1, 2, 3]
      })
      expect(result.object_array).toBeUndefined()
    })

    it('should include model properties not in _raw', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          name: 'John Doe'
        },
        trainerId: 'trainer123',
        userId: 'user123',
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'profiles' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        trainerId: 'trainer123',
        userId: 'user123'
      })
    })

    it('should skip undefined and null values but keep falsy values', () => {
      // Arrange
      const dbRecord = {
        id: '123',
        _raw: {
          name: 'John Doe',
          undefined_field: undefined,
          null_field: null,
          zero_field: 0,
          false_field: false,
          empty_string_field: ''
        },
        syncStatus: 'created'
      }

      const options: TransformOptions = { tableName: 'profiles' }

      // Act
      const result = transformer.transformRecordForAPI(dbRecord, options)

      // Assert
      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        zero_field: 0,
        false_field: false,
        empty_string_field: ''
      })
      expect(result.undefined_field).toBeUndefined()
      expect(result.null_field).toBeUndefined()
    })
  })
})