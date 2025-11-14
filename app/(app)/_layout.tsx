import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Stack } from 'expo-router';
import { useInitializeStores } from '@/hooks/useInitializeStores';
import { useEffect } from 'react';
import { syncManager } from '@/lib/sync/syncManager';

export default function AppLayout() {
  // Register for push notifications when the user is logged in
  usePushNotifications();
  useInitializeStores();

  // Initialize sync manager
  useEffect(() => {
    syncManager.initialize();
  }, []);

  // This layout can be used to configure screen options for the protected app routes.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(trainer)" />
    </Stack>
  );
}
      