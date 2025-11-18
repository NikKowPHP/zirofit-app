import useAuthStore from '@/store/authStore';
import useClientStore from '@/store/clientStore';
import useProgramStore from '@/store/programStore';
import { useEffect } from 'react';
import { syncManager } from '@/lib/sync/syncManager';

let storesInitialized = false;

export function useInitializeStores() {
    const { user } = useAuthStore();

    useEffect(() => {
        // Initialize stores when user is available
        if (user?.id && !storesInitialized) {
            console.log("Initializing trainer stores...");
            useClientStore.getState().init();
            useProgramStore.getState().init();
            storesInitialized = true;

            // Kick off an initial sync so dashboards don't get stuck at "Never synced"
            (async () => {
                try {
                    await syncManager.forceSync();
                } catch (error) {
                    console.error('Initial sync failed:', error);
                }
            })();
        } else if (!user?.id) {
            // Reset on logout
            storesInitialized = false;
        }
    }, [user?.id]);
}
      