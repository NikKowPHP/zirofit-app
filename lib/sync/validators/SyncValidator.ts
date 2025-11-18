export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data: any
}

export interface SyncChanges {
  [tableName: string]: {
    created?: any[]
    updated?: any[]
    deleted?: string[]
  }
}

/**
 * Handles validation of sync data before sending to backend
 */
export class SyncValidator {
  /**
   * Validate the overall sync changes structure
   */
  validateSyncChanges(changes: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: null
    }

    try {
      // Validate the overall structure
      if (!changes || typeof changes !== 'object') {
        result.isValid = false
        result.errors.push('Invalid changes structure - must be an object')
        return result
      }

      const validatedChanges: SyncChanges = {}
      const tableNames = Object.keys(changes)

      if (tableNames.length === 0) {
        result.warnings.push('No tables to sync')
        result.data = validatedChanges
        return result
      }

      for (const tableName of tableNames) {
        const validation = this.validateTableChanges(tableName, changes[tableName])
        
        if (validation.errors.length > 0) {
          result.isValid = false
          result.errors.push(...validation.errors.map(err => `${tableName}: ${err}`))
        }
        
        if (validation.warnings.length > 0) {
          result.warnings.push(...validation.warnings.map(warn => `${tableName}: ${warn}`))
        }

        if (validation.data) {
          validatedChanges[tableName] = validation.data
        }
      }

      result.data = Object.keys(validatedChanges).length > 0 ? validatedChanges : null
      
      if (!result.data) {
        result.warnings.push('No valid changes to sync')
      }

    } catch (error) {
      result.isValid = false
      result.errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`)
    }

    return result
  }

  /**
   * Validate changes for a specific table
   */
  private validateTableChanges(tableName: string, tableChanges: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: null
    }

    try {
      // Validate table name
      if (!tableName || typeof tableName !== 'string') {
        result.isValid = false
        result.errors.push('Invalid table name - must be a non-empty string')
        return result
      }

      // Validate table changes structure
      if (!tableChanges || typeof tableChanges !== 'object') {
        result.isValid = false
        result.errors.push('Invalid changes structure for table - must be an object')
        return result
      }

      const validatedTableChanges: any = {}

      // Validate created records
      if (tableChanges.created !== undefined) {
        const validation = this.validateRecordArray(tableChanges.created, 'created')
        if (validation.errors.length > 0) {
          result.isValid = false
          result.errors.push(...validation.errors)
        }
        validatedTableChanges.created = validation.data
      }

      // Validate updated records
      if (tableChanges.updated !== undefined) {
        const validation = this.validateRecordArray(tableChanges.updated, 'updated')
        if (validation.errors.length > 0) {
          result.isValid = false
          result.errors.push(...validation.errors)
        }
        validatedTableChanges.updated = validation.data
      }

      // Validate deleted IDs
      if (tableChanges.deleted !== undefined) {
        const validation = this.validateIdArray(tableChanges.deleted, 'deleted')
        if (validation.errors.length > 0) {
          result.isValid = false
          result.errors.push(...validation.errors)
        }
        validatedTableChanges.deleted = validation.data
      }

      // Only include tables that have valid changes
      if (Object.keys(validatedTableChanges).length > 0) {
        result.data = validatedTableChanges
      }

    } catch (error) {
      result.isValid = false
      result.errors.push(`Table validation failed: ${error instanceof Error ? error.message : String(error)}`)
    }

    return result
  }

  /**
   * Validate an array of records
   */
  private validateRecordArray(records: any[], changeType: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: []
    }

    if (!Array.isArray(records)) {
      result.isValid = false
      result.errors.push(`${changeType} must be an array`)
      return result
    }

    if (records.length === 0) {
      result.data = []
      return result
    }

    const validRecords: any[] = []

    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      
      if (!record || typeof record !== 'object') {
        result.warnings.push(`${changeType}[${i}]: Invalid record - must be an object`)
        continue
      }

      if (!record.id) {
        result.warnings.push(`${changeType}[${i}]: Missing required id field`)
        continue
      }

      if (typeof record.id !== 'string' && typeof record.id !== 'number') {
        result.warnings.push(`${changeType}[${i}]: Invalid id - must be string or number`)
        continue
      }

      validRecords.push(record)
    }

    result.data = validRecords
    return result
  }

  /**
   * Validate an array of IDs
   */
  private validateIdArray(ids: any[], changeType: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: []
    }

    if (!Array.isArray(ids)) {
      result.isValid = false
      result.errors.push(`${changeType} must be an array`)
      return result
    }

    if (ids.length === 0) {
      result.data = []
      return result
    }

    const validIds: string[] = []

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      
      if (!id) {
        result.warnings.push(`${changeType}[${i}]: Invalid ID - cannot be null or empty`)
        continue
      }

      if (typeof id !== 'string') {
        result.warnings.push(`${changeType}[${i}]: Invalid ID - must be string`)
        continue
      }

      validIds.push(id)
    }

    result.data = validIds
    return result
  }

  /**
   * Validate individual record structure
   */
  validateRecord(record: any, context?: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: record
    }

    const ctx = context ? `(${context})` : ''

    if (!record || typeof record !== 'object') {
      result.isValid = false
      result.errors.push(`Invalid record${ctx} - must be an object`)
      return result
    }

    if (!record.id) {
      result.isValid = false
      result.errors.push(`Missing required id field${ctx}`)
      return result
    }

    if (typeof record.id !== 'string' && typeof record.id !== 'number') {
      result.isValid = false
      result.errors.push(`Invalid id${ctx} - must be string or number`)
      return result
    }

    // Check for required fields based on record type
    // This could be expanded based on specific model requirements
    const requiredFields = this.getRequiredFieldsForRecord(record)
    for (const field of requiredFields) {
      if (record[field] === undefined || record[field] === null) {
        result.warnings.push(`Missing field: ${field}${ctx}`)
      }
    }

    return result
  }

  /**
   * Get required fields based on record structure
   */
  private getRequiredFieldsForRecord(record: any): string[] {
    const requiredFields: string[] = []

    // Basic required fields for most records
    if (record.userId && !record.clientId) {
      // User profile related
      requiredFields.push('userId')
    } else if (record.clientId) {
      // Client related
      requiredFields.push('clientId')
    }

    // Add more specific requirements based on record type
    if (record.trainerId) {
      requiredFields.push('trainerId')
    }

    return requiredFields
  }

  /**
   * Create a summary of validation results
   */
  summarizeValidation(result: ValidationResult): string {
    const lines: string[] = []

    if (result.isValid) {
      lines.push('✅ Validation passed')
    } else {
      lines.push('❌ Validation failed')
    }

    if (result.errors.length > 0) {
      lines.push(`Errors (${result.errors.length}):`)
      result.errors.forEach(error => lines.push(`  - ${error}`))
    }

    if (result.warnings.length > 0) {
      lines.push(`Warnings (${result.warnings.length}):`)
      result.warnings.forEach(warning => lines.push(`  - ${warning}`))
    }

    if (result.data) {
      const tableCount = typeof result.data === 'object' && result.data !== null 
        ? Object.keys(result.data).length 
        : 0
      lines.push(`Valid tables: ${tableCount}`)
    }

    return lines.join('\n')
  }
}