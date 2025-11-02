<response>
  <reasoning>
    The user reported being redirected to the client functionality after logging in as a trainer. This suggests a race condition where the application redirects before the new user's profile (and role) is fetched and stored.

    The root cause is that the old user's profile from a previous session can persist in the global state (`authStore`) after a new user logs in. The redirection logic in `app/(app)/index.tsx` then uses this stale profile data, leading to the incorrect redirect.

    To fix this, I will modify the `setSession` function in `store/authStore.ts`. The new logic will check if the user ID in the new session is different from the user ID in the current state. If they are different, it will clear the stored profile. This forces the application to refetch the correct profile for the newly logged-in user, ensuring the role-based redirection works correctly.
  </reasoning>
  <modifications>
    <file path="store/authStore.ts">
      <![CDATA[
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
      ]]>
    </file>
    <file path="TASKS.md">
      <![CDATA[
- [x] Fix `localStorage` error on web build by dynamically importing `expo-notifications` on the client.
- [x] Fix syntax error in `usePushNotifications.ts` causing Tamagui parse error.
- [x] Fix Expo Router layout structure for client tabs to remove warnings.
- [x] Fix TypeScript error in `BlurView` by providing a default for `colorScheme`.
- [x] Resolve dependency conflicts and standardize on `victory-native` for charting.
- [x] Fix `import.meta` syntax error on web by expanding the babel include list in `app.json` for web builds.
- [x] Add logout functionality.
- [x] Refactor dashboard fetching to use unified `/api/dashboard` endpoint.
- [x] Answer question about trainer functionality.
- [x] Fix incorrect redirect after trainer login.
      ]]>
    </file>
  </modifications>
</response>