import { Stack } from 'expo-router';

export default function AuthLayout() {
  // This layout can be used to configure screen options for the auth flow.
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Sign In" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
    </Stack>
  );
}
      