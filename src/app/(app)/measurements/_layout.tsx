import { Stack } from 'expo-router';

export default function MeasurementsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" options={{ title: 'Create measurement' }} />
      <Stack.Screen name="[id]" options={{ title: 'Measurement' }} />
    </Stack>
  );
}
