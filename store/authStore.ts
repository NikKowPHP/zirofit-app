import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: any | null; // Replace 'any' with a proper profile type
  authenticationState: 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (session: Session | null) => void;
  setProfile: (profile: any) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      profile: null,
      authenticationState: 'loading',
      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
          authenticationState: session ? 'authenticated' : 'unauthenticated',
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
      