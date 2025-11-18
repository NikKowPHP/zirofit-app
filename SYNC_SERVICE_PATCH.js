// This is a patch file containing the exact changes needed for lib/sync/syncService.ts
// Apply these changes manually to fix the sync issues

// === CHANGE 1: Add validation before sending data (around line 129) ===
// Replace this code:
/*
      const data = await apiFetch('/sync/push', {
        method: 'POST',
        body: JSON.stringify({ changes })
      })
*/

// With this code:
/*
      // Validate the changes structure before sending
      const validatedChanges = this.validateChangesForBackend(changes)
      if (!validatedChanges) {
        console.error('Changes validation failed - not pushing')
        useSyncStore.getState().setStatus('idle')
        return
      }

      const data = await apiFetch('/sync/push', {
        method: 'POST',
        body: JSON.stringify({ changes: validatedChanges })
      })
*/

// === CHANGE 2: Fix table name validation (around line 376) ===
// Replace this code:
/*
    const actualTableName = tableName || record.collection?.table || record.modelClass?.table || ''
*/

// With this code:
/*
    const actualTableName = tableName || record.collection?.table || record.modelClass?.table
    
    // Validate that we have a table name
    if (!actualTableName) {
      console.warn('transformRecordForAPI: No table name provided, using fallback logic')
      // Try to infer table name from record structure as fallback
      if (record.userId) {
        return this.transformUserProfileForAPI(record, rawRecord)
      } else if (record.clientId) {
        return this.transformClientRelatedRecordForAPI(record, rawRecord)
      } else {
        console.error('transformRecordForAPI: Could not determine table name for record:', record.id)
        return { id: record.id || rawRecord.id }
      }
    }
*/

// === CHANGE 3: Add validateChangesForBackend method (add before the closing brace) ===
/*
  private validateChangesForBackend(changes: any): any {
    try {
      // Validate the overall structure
      if (!changes || typeof changes !== 'object') {
        console.error('validateChangesForBackend: Invalid changes structure')
        return null
      }

      const validatedChanges: any = {}

      for (const [tableName, tableChanges] of Object.entries(changes)) {
        // Validate table name
        if (!tableName || typeof tableName !== 'string') {
          console.warn('validateChangesForBackend: Invalid table name:', tableName)
          continue
        }

        // Validate table changes structure
        if (!tableChanges || typeof tableChanges !== 'object') {
          console.warn('validateChangesForBackend: Invalid changes structure for table:', tableName)
          continue
        }

        // Validate each type of change
        const validatedTableChanges: any = {}

        if (tableChanges.created) {
          if (Array.isArray(tableChanges.created)) {
            validatedTableChanges.created = tableChanges.created.filter(record => {
              if (!record || typeof record !== 'object' || !record.id) {
                console.warn('validateChangesForBackend: Invalid created record:', record)
                return false
              }
              return true
            })
          }
        }

        if (tableChanges.updated) {
          if (Array.isArray(tableChanges.updated)) {
            validatedTableChanges.updated = tableChanges.updated.filter(record => {
              if (!record || typeof record !== 'object' || !record.id) {
                console.warn('validateChangesForBackend: Invalid updated record:', record)
                return false
              }
              return true
            })
          }
        }

        if (tableChanges.deleted) {
          if (Array.isArray(tableChanges.deleted)) {
            validatedTableChanges.deleted = tableChanges.deleted.filter(id => {
              if (!id || typeof id !== 'string') {
                console.warn('validateChangesForBackend: Invalid deleted ID:', id)
                return false
              }
              return true
            })
          }
        }

        // Only include tables that have valid changes
        if (Object.keys(validatedTableChanges).length > 0) {
          validatedChanges[tableName] = validatedTableChanges
        }
      }

      // Log validation results
      console.log('validateChangesForBackend: Validated changes structure:', Object.keys(validatedChanges))
      
      return Object.keys(validatedChanges).length > 0 ? validatedChanges : null
    } catch (error) {
      console.error('validateChangesForBackend: Validation failed:', error)
      return null
    }
  }
*/

// === CHANGE 4: Add fallback methods (add before the closing brace) ===
/*
  private transformUserProfileForAPI(record: any, rawRecord: any): any {
    // Fallback for user profile records
    const transformed: any = { id: record.id || rawRecord.id }
    
    // Include common profile fields
    if (rawRecord.user_id || record.userId) {
      transformed.userId = rawRecord.user_id || record.userId
    }
    
    return transformed
  }

  private transformClientRelatedRecordForAPI(record: any, rawRecord: any): any {
    // Fallback for client-related records
    const transformed: any = { id: record.id || rawRecord.id }
    
    // Include common client fields
    if (rawRecord.client_id || record.clientId) {
      transformed.clientId = rawRecord.client_id || record.clientId
    }
    
    return transformed
  }
*/