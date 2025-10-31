import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Stack } from 'expo-router';

export default function AppLayout() {
  // Register for push notifications when the user is logged in
  usePushNotifications();

  // This layout can be used to configure screen options for the protected app routes.
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(client)" />
    <Stack.Screen name="(trainer)" />
  </Stack>;
}
      