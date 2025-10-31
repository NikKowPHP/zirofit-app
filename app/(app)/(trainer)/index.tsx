import { Redirect } from 'expo-router';

// Redirect from the group root to the first tab.
export default function TrainerIndex() {
  return <Redirect href="/(trainer)/(tabs)/dashboard" />;
}
      