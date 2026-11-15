import { Stack } from 'expo-router';

import { canAccessUsers } from '@/constants/menu';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/providers/AuthProvider';
import { ROLES } from '@/types/users.types';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  const colors = useTheme();
  const { user } = useSession();
  const canManageUsers = canAccessUsers(user?.role ?? ROLES.ADMIN);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="measurements" />
      <Stack.Screen name="jobs" options={{ title: 'Jobs' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Protected guard={canManageUsers}>
        <Stack.Screen name="users" options={{ title: 'Users' }} />
      </Stack.Protected>
    </Stack>
  );
}
