import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_TABS, getMoreMenuSections } from '@/constants/menu';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/providers/AuthProvider';
import { ROLES } from '@/types/users.types';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function AppTabsLayout() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useSession();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const moreSections = getMoreMenuSections(user?.role ?? ROLES.ADMIN);

  const optionsFor = (item: (typeof BOTTOM_TABS)[number], more = false) => ({
    title: item.label,
    tabBarAccessibilityLabel: item.label,
    tabBarLabel: ({ focused }: { focused: boolean }) =>
      focused || (more && drawerVisible) ? (
        <Text style={[styles.activeLabel, { color: colors.primary }]}>{item.label}</Text>
      ) : null,
    tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => (
      <MaterialCommunityIcons
        name={item.icon}
        size={size}
        color={focused || (more && drawerVisible) ? colors.primary : colors.textSecondary}
      />
    ),
  });

  const confirmSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          setDrawerVisible(false);
          void signOut();
        },
      },
    ]);
  };

  const closeDrawer = () => setDrawerVisible(false);

  return (
    <>
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
        <Tabs.Screen
          name="more"
          options={optionsFor(BOTTOM_TABS[3], true)}
          listeners={{
            tabPress: (event) => {
              event.preventDefault();
              setDrawerVisible(true);
            },
          }}
        />
      </Tabs>

      <Modal
        visible={drawerVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeDrawer}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close navigation menu"
            onPress={closeDrawer}
            style={styles.scrim}
          />
          <SafeAreaView
            edges={['top', 'bottom']}
            style={[styles.drawer, { backgroundColor: colors.surface, borderColor: colors.outline }]}
          >
            <View style={styles.drawerHeader}>
              <View>
                <Text variant="titleLarge" style={{ color: colors.primary, fontWeight: '800' }}>
                  Zynstitch
                </Text>
                <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                  Workspace navigation
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                onPress={closeDrawer}
                hitSlop={8}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <View style={[styles.drawerAccount, { backgroundColor: colors.background }]}>
              <View style={[styles.avatar, { backgroundColor: colors.backgroundSelected }]}>
                <Text variant="titleMedium" style={{ color: colors.primary, fontWeight: '700' }}>
                  {(user?.name ?? 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.accountCopy}>
                <Text variant="titleSmall">{user?.name ?? 'User'}</Text>
                <Text variant="bodySmall" numberOfLines={1} style={{ color: colors.textSecondary }}>
                  {user?.email}
                </Text>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.drawerMenu}>
              {moreSections.map((section) => (
                <View key={section.title} style={styles.menuSection}>
                  <Text variant="labelLarge" style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    {section.title}
                  </Text>
                  <View style={[styles.menuCard, { borderColor: colors.outline }]}>
                    {section.items.map((item, index) => {
                      const active = 'href' in item && pathname === item.href;
                      const handlePress = () => {
                        if ('action' in item) {
                          confirmSignOut();
                          return;
                        }
                        closeDrawer();
                        router.push(item.href);
                      };

                      return (
                        <View key={'href' in item ? item.href : item.action}>
                          {index > 0 ? <View style={[styles.separator, { backgroundColor: colors.outline }]} /> : null}
                          <Pressable
                            onPress={handlePress}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                            style={({ pressed }) => [
                              styles.menuRow,
                              active && { backgroundColor: colors.backgroundSelected },
                              pressed && styles.pressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={item.icon}
                              size={22}
                              color={active ? colors.primary : 'action' in item ? '#b3261e' : colors.text}
                            />
                            <Text
                              variant="titleSmall"
                              style={[
                                styles.menuLabel,
                                { color: active ? colors.primary : 'action' in item ? '#b3261e' : colors.text },
                              ]}
                            >
                              {item.label}
                            </Text>
                            {'action' in item ? null : (
                              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
                            )}
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </>
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
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
  },
  drawer: {
    width: '86%',
    maxWidth: 360,
    height: '100%',
    borderRightWidth: StyleSheet.hairlineWidth,
    elevation: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 4, height: 0 },
  },
  drawerHeader: {
    minHeight: 76,
    paddingHorizontal: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  drawerAccount: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountCopy: {
    flex: 1,
    gap: 2,
  },
  drawerMenu: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  menuSection: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    paddingHorizontal: Spacing.one,
  },
  menuCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  menuLabel: {
    flex: 1,
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.7,
  },
});
