import { Stack } from 'expo-router';

export default function MeasurementsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ title: 'Create measurement', headerBackTitle: 'Measurements' }} />
      <Stack.Screen name="[id]" options={{ title: 'Measurement details', headerBackTitle: 'Measurements' }} />
    </Stack>
  );
}
