import { supabase } from '../supabase';
import { getMe } from '../api';
import useAuthStore from '@/store/authStore';

/**
 * Creates or updates user profile for Google OAuth users
 * @param user - Supabase user object
 * @param role - User's role (for new users)
 */
const upsertGoogleUserProfile = async (user: any, role?: 'client' | 'trainer') => {
  try {
    const googleUserData = extractGoogleUserData(user);
    if (!googleUserData) return null;

    const userProfile = {
      id: user.id,
      email: user.email || googleUserData.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || googleUserData.name,
      avatar_url: user.user_metadata?.avatar_url || googleUserData.picture,
      role: role || 'client', // Default to client if no role specified
      is_google_user: true,
      google_user_data: googleUserData
    };

    // Update the auth store with the user profile
    useAuthStore.getState().setProfile(userProfile);
    
    return userProfile;
  } catch (error) {
    console.error('Error creating/updating Google user profile:', error);
    return null;
  }
};

/**
 * Google OAuth Authentication Service
 * Handles Google Sign In and Sign Up flows with Supabase
 */

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
  locale?: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  user?: GoogleUser;
  session?: any;
  error?: string;
}

/**
 * Initiates Google OAuth Sign In flow
 * @returns Promise with authentication result
 */
export const signInWithGoogle = async (): Promise<GoogleAuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error('Google Sign In Error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Note: The actual session handling will be managed by the Supabase auth listener
    // in the main layout component
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Google Sign In Exception:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during Google Sign In'
    };
  }
};

/**
 * Initiates Google OAuth Sign Up flow with role selection
 * @param role - User's role ('client' or 'trainer')
 * @returns Promise with authentication result
 */
export const signUpWithGoogle = async (role: 'client' | 'trainer'): Promise<GoogleAuthResponse> => {
  try {
    // Store role in localStorage to be used after OAuth callback
    if (typeof window !== 'undefined') {
      localStorage.setItem('pending_user_role', role);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
      }
    });

    if (error) {
      console.error('Google Sign Up Error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error: any) {
    console.error('Google Sign Up Exception:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during Google Sign Up'
    };
  }
};

/**
 * Handles Google OAuth callback and session management
 * This function should be called when the app returns from Google OAuth flow
 */
export const handleGoogleOAuthCallback = async (): Promise<GoogleAuthResponse> => {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session Error:', sessionError);
      return {
        success: false,
        error: sessionError.message
      };
    }

    if (!session) {
      return {
        success: false,
        error: 'No active session found'
      };
    }

    // Check if this is a Google OAuth user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'No user found in session'
      };
    }

    // Verify this is a Google OAuth user
    const isGoogleUser = user.identities?.some((identity: any) => identity.provider === 'google');
    
    if (!isGoogleUser) {
      return {
        success: false,
        error: 'User is not authenticated with Google'
      };
    }

    // Get user profile data
    let profile = await getMe();
    
    // If no profile exists yet (new Google user), create one
    if (!profile) {
      // Check for pending role from sign up flow
      let role: 'client' | 'trainer' | undefined = undefined;
      if (typeof window !== 'undefined') {
        const pendingRole = localStorage.getItem('pending_user_role');
        if (pendingRole && (pendingRole === 'client' || pendingRole === 'trainer')) {
          role = pendingRole as 'client' | 'trainer';
          localStorage.removeItem('pending_user_role');
        }
      }
      
      profile = await upsertGoogleUserProfile(user, role);
    } else {
      // Update existing profile with Google user data
      const googleUserData = extractGoogleUserData(user);
      if (googleUserData) {
        profile.is_google_user = true;
        profile.google_user_data = googleUserData;
        useAuthStore.getState().setProfile(profile);
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        picture: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        verified_email: user.email ? true : false
      },
      session: session
    };
  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to handle OAuth callback'
    };
  }
};

/**
 * Extracts Google user data from Supabase user metadata
 * @param user - Supabase user object
 * @returns Google user data
 */
export const extractGoogleUserData = (user: any): GoogleUser | null => {
  if (!user || !user.identities?.some((identity: { provider: string }) => identity.provider === 'google')) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.user_metadata?.name || '',
    picture: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    verified_email: user.email ? true : false,
    locale: user.user_metadata?.locale
  };
};

/**
 * Checks if user is authenticated with Google OAuth
 * @param user - Supabase user object
 * @returns boolean indicating if user is Google authenticated
 */
export const isGoogleUser = (user: any): boolean => {
  return user?.identities?.some((identity: any) => identity.provider === 'google') || false;
};

/**
 * Gets the user's role from profile or defaults to 'client'
 * @param profile - User profile from auth store
 * @returns user role
 */
export const getUserRole = (profile: any): 'client' | 'trainer' => {
  return profile?.role || 'client';
};

/**
 * Error codes for Google OAuth
 */
export const GoogleAuthErrors = {
  NETWORK_ERROR: 'network_error',
  OAUTH_ERROR: 'oauth_error',
  USER_CANCELLED: 'user_cancelled',
  INVALID_TOKEN: 'invalid_token',
  SESSION_EXPIRED: 'session_expired',
  PROFILE_ERROR: 'profile_error'
} as const;