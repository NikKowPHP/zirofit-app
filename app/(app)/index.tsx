import { Redirect } from 'expo-router';

export default function AppIndex() {
  // Redirects from the app root to the main tabs navigator.
  return <Redirect href="/(tabs)" />;
}
      