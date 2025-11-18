import { Stack } from 'expo-router';

export default function ClientsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Clients" }} />
      <Stack.Screen name="create" options={{ title: "Add New Client", presentation: 'modal' }} />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: "Client Details",
          headerShown: false, // We have a custom header in the client layout
        }} 
      />
    </Stack>
  );
}
      