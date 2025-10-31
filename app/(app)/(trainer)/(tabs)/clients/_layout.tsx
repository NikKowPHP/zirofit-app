import { Stack } from 'expo-router';

export default function ClientsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Clients", headerShown: false }} />
      <Stack.Screen name="../../client/[id]" options={{ title: "Client Details" }} />
      <Stack.Screen name="../../client/[id]/live" options={{ title: "Live Workout" }} />
    </Stack>
  );
}
      