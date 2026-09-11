import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-trip" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="trip/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="trip/edit-[id]" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
