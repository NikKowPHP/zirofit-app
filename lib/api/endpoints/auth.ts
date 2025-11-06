import { apiFetch } from '../core/apiFetch';
import type {
  AuthRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../types';
import type { UserProfile } from '@/store/authStore';

/**
 * Authentication API endpoints
 */

/**
 * Normalize various backend response shapes to a user profile object
 */
const normalizeUserProfile = (response: any): UserProfile | null => {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return null;
  }

  if ('user' in response && response.user) {
    return response.user as UserProfile;
  }

  if ('profile' in response && response.profile) {
    return response.profile as UserProfile;
  }

  if ('data' in response && response.data) {
    const data = (response as { data: any }).data;

    if (data && typeof data === 'object') {
      if ('user' in data && data.user) {
        return data.user as UserProfile;
      }
      if ('profile' in data && data.profile) {
        return data.profile as UserProfile;
      }
      if (!Array.isArray(data)) {
        return data as UserProfile;
      }
    }
  }

  return response as UserProfile;
};

/**
 * Get current user information
 * @returns User information or null if not authenticated
 */
export const getMe = async (): Promise<UserProfile | null> => {
  const response = await apiFetch('/auth/me');
  return normalizeUserProfile(response);
};

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