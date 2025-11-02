import { Stack } from 'expo-router';

export default function ProgramsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Programs" }} />
      <Stack.Screen name="[id]" options={{ title: "Template Editor" }} />
    </Stack>
  );
}
      