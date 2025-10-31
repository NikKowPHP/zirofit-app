import { Stack } from 'expo-router';

export default function AuthLayout() {
  // This layout can be used to configure screen options for the auth flow.
  return <Stack screenOptions={{ headerShown: false }} />;
}
      