import { Stack } from 'expo-router';

import { canAccessUsers } from '@/constants/menu';
import { useSession } from '@/providers/AuthProvider';
import { ROLES } from '@/types/users.types';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  const { user } = useSession();
  const canManageUsers = canAccessUsers(user?.role ?? ROLES.ADMIN);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="measurements" />
      <Stack.Screen name="jobs" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="profile" />
      <Stack.Protected guard={canManageUsers}>
        <Stack.Screen name="users" />
      </Stack.Protected>
    </Stack>
  );
}
