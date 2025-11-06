import { Stack } from 'expo-router';

export default function ClientsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Clients" }} />
      <Stack.Screen name="create" options={{ title: "Add New Client", presentation: 'modal' }} />
    </Stack>
  );
}
      