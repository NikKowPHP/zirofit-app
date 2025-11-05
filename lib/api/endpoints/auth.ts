import { apiFetch } from '../core/apiFetch';
import type { 
  AuthRequest, 
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../types';

/**
 * Authentication API endpoints
 */

/**
 * Get current user information
 * @returns User information or null if not authenticated
 */
export const getMe = () => apiFetch('/auth/me');

/**
 * Sync user data with the backend
 * @param data Sync data
 * @returns Sync result
 */
export const syncUser = (data: any) => apiFetch('/auth/sync-user', {
  method: 'POST',
  body: JSON.stringify(data)
});

/**
 * User logout
 * @returns Logout result
 */
export const signout = () => apiFetch('/auth/signout', {
  method: 'POST'
});

/**
 * Register a new user
 * @param request Registration data
 * @returns Auth response with user and token
 */
export const register = (request: RegisterRequest): Promise<AuthResponse> => 
  apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * User login
 * @param request Login credentials
 * @returns Auth response with user and token
 */
export const login = (request: LoginRequest): Promise<AuthResponse> => 
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(request)
  });