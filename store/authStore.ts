import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  [key: string]: any; // Allow other properties
};

type AuthState = {
  session: Session | null;
  user: User | null;
  authenticationState: 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (session: Session | null) => void;
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
            return {
                session,
                user: session?.user ?? null,
                authenticationState: session ? 'authenticated' : 'unauthenticated',
            };
        });
      },
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        user: state.user
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
      