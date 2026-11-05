import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DrawerContentScrollView } from 'expo-router/drawer';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-paper';

import { getAllowedMenu } from '@/constants/menu';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/providers/AuthProvider';
import { useThemeMode } from '@/providers/ThemeProvider';
import { ROLES } from '@/types/users.types';

export function AppDrawerContent() {
  const colors = useTheme();
  const pathname = usePathname();
  const { user, signOut } = useSession();
  const { mode, toggleTheme } = useThemeMode();
  const menu = getAllowedMenu(user?.role ?? ROLES.ADMIN);

  return (
    <DrawerContentScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text variant="titleLarge" style={styles.brand}>
          Zynstitch
        </Text>
        <Text variant="bodySmall" style={styles.headerSub}>
          Tailoring operations
        </Text>
      </View>

      <View style={styles.menu}>
        {menu.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href)}
              style={[
                styles.item,
                active && { backgroundColor: `${colors.primary}22` },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={active ? colors.primary : colors.text}
              />
              <Text
                variant="titleSmall"
                style={{ color: active ? colors.primary : colors.text, fontWeight: '600' }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.spacer} />
      <Divider />

      <Pressable style={styles.userRow} onPress={() => router.push('/profile')}>
        <Avatar.Text
          size={40}
          label={(user?.name ?? 'U').charAt(0).toUpperCase()}
          style={{ backgroundColor: colors.primary }}
        />
        <View style={styles.userCopy}>
          <Text variant="titleSmall">{user?.name || 'User'}</Text>
          <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
            {user?.role ?? 'ADMIN'}
          </Text>
        </View>
      </Pressable>

      <Pressable style={styles.item} onPress={toggleTheme}>
        <MaterialCommunityIcons
          name={mode === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
          size={22}
          color={colors.text}
        />
        <Text variant="titleSmall">{mode === 'dark' ? 'Light mode' : 'Dark mode'}</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => void signOut()}>
        <MaterialCommunityIcons name="logout" size={22} color={colors.text} />
        <Text variant="titleSmall">Logout</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  brand: {
    color: '#fff',
    fontWeight: '800',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.85)',
  },
  menu: {
    paddingVertical: Spacing.two,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: 12,
  },
  spacer: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  userCopy: {
    flex: 1,
  },
});
