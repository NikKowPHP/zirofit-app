import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  // This should match your backend's profile structure
  id: string;
  role: 'client' | 'trainer';
  [key: string]: any; // Allow other properties
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  authenticationState: 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      profile: null,
      authenticationState: 'loading',
      setSession: (session) => {
        set((state) => {
            // If the user ID changes (or on logout), clear the profile to force a refetch.
            const profile = state.user?.id === session?.user?.id ? state.profile : null;
            return {
                session,
                user: session?.user ?? null,
                profile,
                authenticationState: session ? 'authenticated' : 'unauthenticated',
            };
        });
      },
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        session: state.session,
        user: state.user,
        profile: state.profile
       }), // Only persist these fields
       onRehydrateStorage: () => (state) => {
        if (state) {
            state.authenticationState = state.session ? 'authenticated' : 'unauthenticated';
        }
       }
    }
  )
);

export default useAuthStore;
      