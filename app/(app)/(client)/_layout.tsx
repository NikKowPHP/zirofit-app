import { Stack } from 'expo-router';
import React from 'react';

export default function ClientLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="session/[id]" />
    </Stack>
  );
}
      