import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';

import { EmptyState } from '@/components/shared/EmptyState';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props<T> = {
  title: string;
  searchPlaceholder?: string;
  load: (
    search: string,
  ) => Promise<{ success: boolean; message: string; items: T[]; total: number }>;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactElement;
  emptyTitle: string;
  emptyDescription?: string;
};

export function EntityListScreen<T>({
  title,
  searchPlaceholder = 'Search',
  load,
  keyExtractor,
  renderItem,
  emptyTitle,
  emptyDescription,
}: Props<T>) {
  const colors = useTheme();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const response = await load(search);
    setLoading(false);
    if (!response.success) {
      setError(response.message);
      return;
    }
    setError(null);
    setItems(response.items);
    setTotal(response.total);
  }, [load, search]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void fetchItems();
    }, 250);
    return () => clearTimeout(handle);
  }, [fetchItems]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Searchbar
        placeholder={searchPlaceholder}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <Text variant="bodySmall" style={[styles.count, { color: colors.textSecondary }]}>
        {title} · {total} record{total === 1 ? '' : 's'}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => void fetchItems()} />
        }
        ListEmptyComponent={
          loading ? undefined : <EmptyState title={emptyTitle} description={emptyDescription} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    margin: Spacing.three,
  },
  count: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
    flexGrow: 1,
  },
  error: {
    color: '#b3261e',
    paddingHorizontal: Spacing.four,
  },
});
