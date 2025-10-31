import { Stack } from 'expo-router';

export default function AppLayout() {
  // This layout can be used to configure screen options for the protected app routes.
  return <Stack screenOptions={{ headerShown: false }} />;
}
      