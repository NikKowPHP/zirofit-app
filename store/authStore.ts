import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: any | null; // Replace 'any' with a proper profile type
  authenticationState: 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (session: Session | null) => void;
  setProfile: (profile: any) => void;
};

const useAuthStore = create<AuthState>((set) => ({
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
}));

export default useAuthStore;
      