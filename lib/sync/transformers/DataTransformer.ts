export interface TransformOptions {
  tableName?: string
}

export interface TransformResult {
  [key: string]: any
}

/**
 * Handles data transformation between frontend WatermelonDB format and backend API format
 */
export class DataTransformer {
  /**
   * Transform API record to WatermelonDB format
   */
  transformRecordForDB(record: any): TransformResult {
    // Transform API record to DB format
    const transformed: any = { ...record }

    // Remove id since it's auto-generated for new records
    delete transformed.id

    // Keep timestamps as numbers (WatermelonDB stores them as numbers)
    if (record.created_at) transformed.createdAt = record.created_at
    if (record.updated_at) transformed.updatedAt = record.updated_at
    if (record.deleted_at) transformed.deletedAt = record.deleted_at

    // Rename fields to match DB schema
    if (record.user_id !== undefined) transformed.userId = record.user_id
    if (record.date_of_birth !== undefined) transformed.dateOfBirth = record.date_of_birth
    // ... other renames

    return transformed
  }

  /**
   * Transform WatermelonDB record to API format
   */
  transformRecordForAPI(record: any, options: TransformOptions = {}): TransformResult {
    const toCamelCase = this.createCamelCaseConverter()
    const rawRecord = record._raw || {}
    const actualTableName = this.determineTableName(record, options.tableName)
    
    // Validate that we have a table name
    if (!actualTableName) {
      console.warn('DataTransformer: No table name provided, using fallback logic')
      return this.createFallbackTransform(record, rawRecord)
    }
    
    const excludeProps = this.getExcludedProperties()
    const transformed: TransformResult = {
      id: record.id || rawRecord.id,
    }

    // Special transformation for client_measurements
    if (actualTableName === 'client_measurements') {
      return this.transformClientMeasurements(record, rawRecord)
    }

    // Extract all fields from _raw (these are the actual database values)
    for (const key of Object.keys(rawRecord)) {
      // Skip excluded properties
      if (excludeProps.has(key)) {
        continue
      }

      const value = rawRecord[key]
      
      // Skip undefined and null values (but allow 0, false, empty string)
      if (value === undefined || value === null) {
        continue
      }

      // Skip if it's the id (already set)
      if (key === 'id') {
        continue
      }

      // Only include primitive values and simple serializable types
      const valueType = typeof value
      const camelKey = toCamelCase(key)
      if (this.isPrimitiveValue(value)) {
        transformed[camelKey] = value
      } else if (Array.isArray(value)) {
        this.handleArrayValue(value, camelKey, transformed)
      }
      // Skip objects, functions, and other complex types that might have circular references
    }

    // Also check model properties for fields that might not be in _raw yet
    this.addModelProperties(record, transformed)

    return transformed
  }

  private createCamelCaseConverter(): (str: string) => string {
    return (str: string): string => {
      return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    }
  }

  private determineTableName(record: any, tableNameOverride?: string): string | null {
    return tableNameOverride || record.collection?.table || record.modelClass?.table || null
  }

  private getExcludedProperties(): Set<string> {
    return new Set([
      '_status',
      '_changed',
      'sync_status', // We don't want to send sync status to the server
      '_table',
    ])
  }

  private createFallbackTransform(record: any, rawRecord: any): TransformResult {
    const transformed: TransformResult = { id: record.id || rawRecord.id }
    
    // Try to infer type based on record structure
    if (record.userId) {
      return this.transformUserProfile(record, rawRecord)
    } else if (record.clientId) {
      return this.transformClientRelatedRecord(record, rawRecord)
    } else {
      console.error('DataTransformer: Could not determine table name for record:', record.id)
      return transformed
    }
  }

  private transformClientMeasurements(record: any, rawRecord: any): TransformResult {
    const measurementType = rawRecord.measurement_type || record.measurementType
    const value = rawRecord.value || record.value
    const unit = rawRecord.unit || record.unit
    const measuredAt = rawRecord.measured_at || record.measuredAt
    const notes = rawRecord.notes || record.notes
    const clientId = rawRecord.client_id || record.clientId

    // Convert timestamp to ISO date string for measurementDate
    const measurementDate = measuredAt ? new Date(measuredAt).toISOString().split('T')[0] : null

    const transformed: TransformResult = {
      clientId,
      measurementDate,
      notes: notes || null,
    }

    // Transform based on measurement type
    if (measurementType === 'weight') {
      // Convert value to weightKg (convert to kg if needed)
      let weightKg = value
      if (unit && unit.toLowerCase() !== 'kg') {
        // Convert lbs to kg
        if (unit.toLowerCase() === 'lbs' || unit.toLowerCase() === 'lb') {
          weightKg = value * 0.453592
        }
        // Add other conversions as needed
      }
      transformed.weightKg = weightKg
      transformed.bodyFatPercentage = null
    } else if (measurementType === 'body_fat' || measurementType === 'bodyFat') {
      transformed.bodyFatPercentage = value
      transformed.weightKg = null
    } else {
      // Store other measurement types in customMetrics
      transformed.customMetrics = JSON.stringify([{
        name: measurementType,
        value: value.toString(),
        unit: unit || ''
      }])
      transformed.weightKg = null
      transformed.bodyFatPercentage = null
    }

    return transformed
  }

  private isPrimitiveValue(value: any): boolean {
    const valueType = typeof value
    return (
      valueType === 'string' ||
      valueType === 'number' ||
      valueType === 'boolean' ||
      value === null
    )
  }

  private handleArrayValue(value: any[], camelKey: string, transformed: TransformResult): void {
    // For arrays, try to serialize if they contain primitives
    // Skip if they contain objects (likely relations)
    if (value.length === 0 || (typeof value[0] !== 'object' && value[0] !== null)) {
      transformed[camelKey] = value
    }
  }

  private addModelProperties(record: any, transformed: TransformResult): void {
    // This is important for fields like trainerId that are required by the API
    const modelProps = ['trainerId', 'userId']
    for (const prop of modelProps) {
      if (!transformed[prop] && record[prop] !== undefined && record[prop] !== null) {
        transformed[prop] = record[prop]
      }
    }
  }

  private transformUserProfile(record: any, rawRecord: any): TransformResult {
    // Fallback for user profile records
    const transformed: TransformResult = { id: record.id || rawRecord.id }
    
    // Include common profile fields
    if (rawRecord.user_id || record.userId) {
      transformed.userId = rawRecord.user_id || record.userId
    }
    
    return transformed
  }

  private transformClientRelatedRecord(record: any, rawRecord: any): TransformResult {
    // Fallback for client-related records
    const transformed: TransformResult = { id: record.id || rawRecord.id }
    
    // Include common client fields
    if (rawRecord.client_id || record.clientId) {
      transformed.clientId = rawRecord.client_id || record.clientId
    }
    
    return transformed
  }
}