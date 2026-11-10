import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getAllowedMenu } from '@/constants/menu';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/providers/AuthProvider';
import { ROLES } from '@/types/users.types';

export const unstable_settings = {
  initialRouteName: 'customers',
};

export default function AppTabsLayout() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const menu = getAllowedMenu(user?.role ?? ROLES.ADMIN);
  const canManageUsers = menu.some((item) => item.href === '/users');

  const optionsFor = (href: (typeof menu)[number]['href']) => {
    const item = menu.find((entry) => entry.href === href)!;

    return {
      title: item.label,
      tabBarAccessibilityLabel: item.label,
      tabBarLabel: ({ focused }: { focused: boolean }) =>
        focused ? <Text style={[styles.activeLabel, { color: colors.primary }]}>{item.label}</Text> : null,
      tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => (
        <MaterialCommunityIcons
          name={item.icon}
          size={size}
          color={focused ? colors.primary : colors.textSecondary}
        />
      ),
    };
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 6),
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen name="customers" options={optionsFor('/customers')} />
      <Tabs.Screen name="measurements" options={optionsFor('/measurements')} />
      <Tabs.Screen name="orders" options={optionsFor('/orders')} />
      <Tabs.Screen name="jobs" options={optionsFor('/jobs')} />
      <Tabs.Screen name="profile" options={optionsFor('/profile')} />
      <Tabs.Protected guard={canManageUsers}>
        <Tabs.Screen name="users" options={optionsFor('/users')} />
      </Tabs.Protected>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    marginTop: 2,
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
