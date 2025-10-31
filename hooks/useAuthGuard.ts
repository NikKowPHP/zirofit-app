import useAuthStore from '@/store/authStore';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useAuthGuard() {
    const { authenticationState } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (authenticationState === 'loading') {
            return; // Wait until session is loaded
        }
        
        if (authenticationState === 'unauthenticated' && !inAuthGroup) {
            // Redirect to login screen if not authenticated and not in auth flow.
            router.replace('/login');
        } else if (authenticationState === 'authenticated' && inAuthGroup) {
            // Redirect to main app if authenticated and in auth flow.
            router.replace('/');
        }
    }, [authenticationState, segments, router]);
}
      