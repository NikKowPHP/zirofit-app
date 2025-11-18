import { apiFetch } from '@/lib/api/core/apiFetch'
import { SyncValidator, SyncChanges } from '../validators/SyncValidator'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

export interface SyncRequest {
  changes: SyncChanges
}

/**
 * Handles communication with the backend sync API
 */
export class ApiAdapter {
  private validator: SyncValidator

  constructor() {
    this.validator = new SyncValidator()
  }

  /**
   * Pull changes from backend
   */
  async pullChanges(lastPulledAt?: string): Promise<ApiResponse<any>> {
    try {
      console.log('API: Pulling changes from backend...')

      const params: Record<string, any> = {}
      if (lastPulledAt) {
        params.last_pulled_at = lastPulledAt
      }

      const data = await apiFetch('/sync/pull', {
        method: 'GET',
        params
      })

      if (data) {
        console.log('API: Successfully pulled changes')
        return {
          success: true,
          data: data.data || data
        }
      } else {
        return {
          success: false,
          error: 'No data received'
        }
      }

    } catch (error) {
      console.error('API: Pull changes failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Push changes to backend with validation
   */
  async pushChanges(changes: SyncChanges): Promise<ApiResponse<any>> {
    try {
      console.log('API: Pushing changes to backend...')

      // Validate changes before sending
      const validationResult = this.validator.validateSyncChanges(changes)
      
      if (!validationResult.isValid) {
        console.error('API: Changes validation failed:', this.validator.summarizeValidation(validationResult))
        return {
          success: false,
          error: `Validation failed: ${validationResult.errors.join(', ')}`
        }
      }

      // Log validation summary
      console.log('API: Validation summary:', this.validator.summarizeValidation(validationResult))

      const validatedChanges = validationResult.data as SyncChanges

      const response = await apiFetch('/sync/push', {
        method: 'POST',
        body: JSON.stringify({ changes: validatedChanges })
      })

      if (response) {
        console.log('API: Successfully pushed changes')
        return {
          success: true,
          data: response
        }
      } else {
        return {
          success: false,
          error: 'No response received'
        }
      }

    } catch (error) {
      console.error('API: Push changes failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Check sync status
   */
  async checkSyncStatus(): Promise<ApiResponse<{ status: string; timestamp: number }>> {
    try {
      const data = await apiFetch('/sync/status', {
        method: 'GET'
      })

      return {
        success: true,
        data: data?.data || data
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Reset sync state on backend
   */
  async resetSyncState(): Promise<ApiResponse<any>> {
    try {
      const data = await apiFetch('/sync/reset', {
        method: 'POST'
      })

      return {
        success: true,
        data
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get sync schema version
   */
  async getSchemaVersion(): Promise<ApiResponse<{ version: string }>> {
    try {
      const data = await apiFetch('/sync/schema-version', {
        method: 'GET'
      })

      return {
        success: true,
        data: data?.data || data
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Validate sync endpoint availability
   */
  async validateEndpoint(): Promise<boolean> {
    try {
      const response = await this.checkSyncStatus()
      return response.success
    } catch (error) {
      console.warn('API: Sync endpoint validation failed:', error)
      return false
    }
  }

  /**
   * Get detailed error information from API response
   */
  private extractErrorDetails(error: any): string {
    if (error && typeof error === 'object') {
      if (error.message) {
        return error.message
      }
      if (error.error) {
        return error.error
      }
      if (error.details) {
        return JSON.stringify(error.details)
      }
    }
    return error instanceof Error ? error.message : String(error)
  }

  /**
   * Log API request details for debugging
   */
  private logRequest(method: string, endpoint: string, data?: any): void {
    console.log(`API: ${method} ${endpoint}`, {
      timestamp: new Date().toISOString(),
      ...(data && { data: this.sanitizeDataForLogging(data) })
    })
  }

  /**
   * Sanitize sensitive data for logging
   */
  private sanitizeDataForLogging(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    const sanitized = { ...data }

    // Remove sensitive fields
    const sensitiveFields = ['token', 'password', 'secret', 'api_key']
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***'
      }
    })

    return sanitized
  }
}