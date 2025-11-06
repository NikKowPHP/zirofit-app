import { supabase } from '../../supabase';
import { ApiFetchError } from './ApiFetchError';
import { API_URL, HTTP_METHODS, ERROR_MESSAGES } from './constants';

export interface ApiFetchOptions extends RequestInit {
  params?: Record<string, any>;
}

/**
 * Core HTTP client for API requests
 * @param endpoint - API endpoint path (without /api prefix)
 * @param options - Request options
 * @returns Promise with response data
 */
export const apiFetch = async (endpoint: string, options: ApiFetchOptions = {}): Promise<any> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
      
    console.log('api request with endpoint', API_URL, endpoint);

    // Handle query parameters for GET requests
    let url = `${API_URL}/api${endpoint}`;
    if (options.method === 'GET' && options.params) {
      const queryParams = new URLSearchParams();
      const params = options.params; // Type assertion to satisfy TypeScript
      Object.keys(params).forEach(key => {
        const paramValue = (params as Record<string, any>)[key];
        if (paramValue !== undefined && paramValue !== null) {
          queryParams.append(key, String(paramValue));
        }
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      // Remove params from options since they're now in the URL
      const { params: _, ...restOptions } = options;
      options = restOptions;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
        // Handle 404 specifically for cases like "no trainer found"
        if (response.status === 404) {
            return null;
        }
        
        const errorBody = await response.text();
        console.error("API Error:", response.status, errorBody);
        
        // Attempt to parse error JSON from backend
        let errorMessage = `Network response was not ok: ${response.statusText}`;
        let errorDetails: any = null;
        
        try {
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.message || errorMessage;
            errorDetails = errorJson.details || errorJson;
            
            // Add specific error handling for common error scenarios
            if (response.status === 401) {
                errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            } else if (response.status === 403) {
                errorMessage = ERROR_MESSAGES.FORBIDDEN;
            } else if (response.status === 422) {
                errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
            } else if (response.status >= 500) {
                errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            }
        } catch (e) {
            // If error body is not JSON, use the raw response text
            if (errorBody && errorBody.length > 0) {
                errorMessage = errorBody;
            }
        }
        
        // Create a more detailed error object
        throw new ApiFetchError(
            errorMessage,
            response.status,
            endpoint,
            options.method || HTTP_METHODS.GET,
            errorDetails
        );
    }

    if (response.status === 204) { // No Content
        return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch API:", error);
    
    // Handle network errors specifically
    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw new ApiFetchError(
        ERROR_MESSAGES.NETWORK_ERROR,
        0,
        endpoint,
        options.method || HTTP_METHODS.GET
      );
    }
    
    // Re-throw ApiFetchError instances as-is since they already contain detailed information
    if (error instanceof ApiFetchError) {
      throw error;
    }
    
    // Handle other errors with more user-friendly messages
    if (error instanceof Error) {
      throw new ApiFetchError(
        error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        0,
        endpoint,
        options.method || HTTP_METHODS.GET
      );
    }
    
    // Fallback error
    throw new ApiFetchError(
      ERROR_MESSAGES.UNKNOWN_ERROR,
      0,
      endpoint,
      options.method || HTTP_METHODS.GET
    );
  }
};