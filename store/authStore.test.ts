import useAuthStore from './authStore';
import { act } from '@testing-library/react-native';

// Mock Supabase session
const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: {
    id: 'mock-user-id',
    email: 'test@example.com',
  },
} as any;


describe('authStore', () => {
    const initialState = useAuthStore.getState();
    beforeEach(() => {
        useAuthStore.setState(initialState);
    });

    it('should set the session and update authentication state', () => {
        act(() => {
            useAuthStore.getState().setSession(mockSession);
        });

        const state = useAuthStore.getState();
        expect(state.session).toEqual(mockSession);
        expect(state.user).toEqual(mockSession.user);
        expect(state.authenticationState).toBe('authenticated');
    });

    it('should clear the session and update authentication state', () => {
        // First, set a session
        act(() => {
            useAuthStore.getState().setSession(mockSession);
        });
        
        // Then, clear it
        act(() => {
            useAuthStore.getState().setSession(null);
        });

        const state = useAuthStore.getState();
        expect(state.session).toBeNull();
        expect(state.user).toBeNull();
        expect(state.authenticationState).toBe('unauthenticated');
    });

    it('should set the user profile', () => {
        const mockProfile = { role: 'client', name: 'John Doe' };
        
        act(() => {
            useAuthStore.getState().setProfile(mockProfile);
        });

        expect(useAuthStore.getState().profile).toEqual(mockProfile);
    });
});
      