import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_TABS } from '@/constants/menu';
import { useTheme } from '@/hooks/use-theme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppTabsLayout() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  const optionsFor = (item: (typeof BOTTOM_TABS)[number]) => ({
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
  });

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
      <Tabs.Screen name="index" options={optionsFor(BOTTOM_TABS[0])} />
      <Tabs.Screen name="customers" options={optionsFor(BOTTOM_TABS[1])} />
      <Tabs.Screen name="orders" options={optionsFor(BOTTOM_TABS[2])} />
      <Tabs.Screen name="more" options={optionsFor(BOTTOM_TABS[3])} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    minHeight: 48,
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
