import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import useClientStore from '@/store/clientStore';
import useProgramStore from '@/store/programStore';

let storesInitialized = false;

export function useInitializeStores() {
    const { profile } = useAuthStore();

    useEffect(() => {
        if (profile?.role === 'trainer' && !storesInitialized) {
            console.log("Initializing trainer stores...");
            useClientStore.getState().init();
            useProgramStore.getState().init();
            storesInitialized = true;
        } else if (!profile) {
            // Reset on logout
            storesInitialized = false;
        }
    }, [profile]);
}
      