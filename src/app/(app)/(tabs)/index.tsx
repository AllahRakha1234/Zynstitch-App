import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { fetchAllCustomers, fetchAllMeasurements, fetchAllOrders } from '@/api';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/providers/AuthProvider';
import type { IOrder } from '@/types/orders.types';

export default function DashboardScreen() {
  const colors = useTheme();
  const router = useRouter();
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ customers: 0, orders: 0, measurements: 0 });
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    let active = true;

    const loadOverview = async () => {
      try {
        const [customerResponse, orderResponse, measurementResponse] = await Promise.all([
          fetchAllCustomers(0, 1),
          fetchAllOrders(0, 3),
          fetchAllMeasurements(0, 1),
        ]);

        if (!active) return;
        setTotals({
          customers: customerResponse.data?.total ?? 0,
          orders: orderResponse.data?.total ?? 0,
          measurements: measurementResponse.data?.total ?? 0,
        });
        setRecentOrders(orderResponse.data?.orders ?? []);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadOverview().catch(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const summaryItems = [
    { label: 'Customers', value: totals.customers, icon: 'account-group-outline' as const, route: '/customers' as const },
    { label: 'Orders', value: totals.orders, icon: 'package-variant-closed' as const, route: '/orders' as const },
    { label: 'Measurements', value: totals.measurements, icon: 'ruler' as const, route: '/measurements' as const },
  ];

  const quickActions = [
    { label: 'Customers', description: 'View customer records', icon: 'account-group-outline' as const, route: '/customers' as const },
    { label: 'Measurements', description: 'Open measurement profiles', icon: 'ruler' as const, route: '/measurements' as const },
    { label: 'Jobs', description: 'Track exports and jobs', icon: 'briefcase-outline' as const, route: '/jobs' as const },
    { label: 'More options', description: 'Settings and account', icon: 'dots-horizontal-circle-outline' as const, route: '/more' as const },
  ];

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>Zynstitch overview</Text>
          <Text variant="headlineSmall" style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'there'}</Text>
        </View>
        <View style={[styles.brandMark, { backgroundColor: colors.backgroundSelected }]}>
          <MaterialCommunityIcons name="content-cut" size={24} color={colors.primary} />
        </View>
      </View>

      <View style={[styles.welcomeCard, { backgroundColor: colors.primary }]}>
        <Text variant="titleLarge" style={styles.welcomeTitle}>Your studio at a glance</Text>
        <Text variant="bodyMedium" style={styles.welcomeDescription}>
          Keep customers, orders, and tailoring work organized from one place.
        </Text>
      </View>

      <View style={styles.sectionHeading}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Overview</Text>
        {loading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      </View>
      <View style={styles.summaryGrid}>
        {summaryItems.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route)}
            accessibilityRole="button"
            accessibilityLabel={`${item.label}: ${item.value}`}
            style={({ pressed }) => [
              styles.summaryCard,
              { backgroundColor: colors.surface, borderColor: colors.outline },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.summaryIcon, { backgroundColor: colors.backgroundSelected }]}>
              <MaterialCommunityIcons name={item.icon} size={21} color={colors.primary} />
            </View>
            <Text variant="headlineSmall" style={styles.summaryValue}>{loading ? '—' : item.value}</Text>
            <Text variant="bodySmall" style={{ color: colors.textSecondary }}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text variant="titleLarge" style={styles.sectionTitle}>Quick access</Text>
      <View style={styles.actionGrid}>
        {quickActions.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => router.push(action.route)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: colors.surface, borderColor: colors.outline },
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name={action.icon} size={24} color={colors.primary} />
            <Text variant="titleSmall" style={styles.actionTitle}>{action.label}</Text>
            <Text variant="bodySmall" style={{ color: colors.textSecondary }}>{action.description}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeading}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Recent orders</Text>
        <Text
          variant="labelLarge"
          onPress={() => router.push('/orders')}
          style={{ color: colors.primary }}
        >
          View all
        </Text>
      </View>
      <View style={[styles.recentCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        {recentOrders.length ? recentOrders.map((order, index) => (
          <View key={order._id ?? order.orderNumber ?? index}>
            {index ? <View style={[styles.separator, { backgroundColor: colors.outline }]} /> : null}
            <View style={styles.orderRow}>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall">{order.orderNumber ?? 'Order'}</Text>
                <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                  {order.customerName ?? order.customerId}
                </Text>
              </View>
              <Text variant="labelMedium" style={{ color: colors.primary }}>
                {order.status.replaceAll('_', ' ')}
              </Text>
            </View>
          </View>
        )) : (
          <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
            {loading ? 'Loading your orders…' : 'No orders to show yet.'}
          </Text>
        )}
      </View>
      <View style={{ height: Spacing.two }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: Spacing.four, paddingTop: Spacing.five, paddingBottom: Spacing.six, gap: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.one },
  greeting: { fontWeight: '700', marginTop: 2 },
  brandMark: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  welcomeCard: { borderRadius: 20, padding: Spacing.four, gap: Spacing.two },
  welcomeTitle: { color: '#fff', fontWeight: '700' },
  welcomeDescription: { color: 'rgba(255,255,255,0.88)', lineHeight: 22 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '700' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  summaryCard: { flexGrow: 1, flexBasis: '30%', minWidth: 96, padding: Spacing.three, borderRadius: 16, borderWidth: 1, gap: Spacing.one },
  summaryIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontWeight: '700' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  actionCard: { width: '48%', minHeight: 128, flexGrow: 1, padding: Spacing.three, borderRadius: 16, borderWidth: 1, gap: Spacing.one },
  actionTitle: { fontWeight: '700' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  recentCard: { borderRadius: 16, borderWidth: 1, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  orderRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  separator: { height: StyleSheet.hairlineWidth },
});
