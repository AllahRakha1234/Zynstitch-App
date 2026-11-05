import { Drawer } from 'expo-router/drawer';

import { AppDrawerContent } from '@/components/sidebar/AppDrawerContent';
import { getAllowedMenu } from '@/constants/menu';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/providers/AuthProvider';
import { ROLES } from '@/types/users.types';

export const unstable_settings = {
  initialRouteName: 'customers',
};

export default function AppDrawerLayout() {
  const colors = useTheme();
  const { user } = useSession();
  const canManageUsers = getAllowedMenu(user?.role ?? ROLES.ADMIN).some(
    (item) => item.href === '/users',
  );

  return (
    <Drawer
      drawerContent={() => <AppDrawerContent />}
      screenOptions={{
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.surface },
        drawerStyle: { backgroundColor: colors.surface, width: 280 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen name="customers" options={{ title: 'Customers' }} />
      <Drawer.Screen name="measurements" options={{ title: 'Measurements' }} />
      <Drawer.Screen name="orders" options={{ title: 'Orders' }} />
      <Drawer.Screen name="jobs" options={{ title: 'Jobs' }} />
      <Drawer.Protected guard={canManageUsers}>
        <Drawer.Screen name="users" options={{ title: 'Users' }} />
      </Drawer.Protected>
      <Drawer.Screen name="profile" options={{ title: 'Profile' }} />
    </Drawer>
  );
}
