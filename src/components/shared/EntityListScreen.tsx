import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Button, Menu, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/shared/EmptyState';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ListFilterOption = {
  label: string;
  value: string;
};

export type ListFilter =
  | {
      key: string;
      label: string;
      type: 'text';
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      type: 'select';
      options: ListFilterOption[];
    };

type Props<T> = {
  title: string;
  filters?: ListFilter[];
  showRefresh?: boolean;
  topSafeArea?: boolean;
  load: (
    filters: Record<string, string>,
  ) => Promise<{ success: boolean; message: string; items: T[]; total: number }>;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactElement;
  emptyTitle: string;
  emptyDescription?: string;
};

export function EntityListScreen<T>({
  title,
  filters = [],
  showRefresh = false,
  topSafeArea = false,
  load,
  keyExtractor,
  renderItem,
  emptyTitle,
  emptyDescription,
}: Props<T>) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(selectedFilters).filter(([, value]) => value.length > 0),
      );
      const response = await load(activeFilters);
      if (!response.success) {
        setError(response.message);
        return;
      }
      setError(null);
      setItems(response.items);
      setTotal(response.total);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load records.');
    } finally {
      setLoading(false);
    }
  }, [load, selectedFilters]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void fetchItems();
    }, 250);
    return () => clearTimeout(handle);
  }, [fetchItems]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topSafeArea ? insets.top : 0 }]}>
      {filters.length || showRefresh ? (
        <View style={styles.filterContainer}>
          {filters.map((filter) =>
            filter.type === 'text' ? (
              <TextInput
                key={filter.key}
                mode="outlined"
                dense
                label={filter.label}
                placeholder={filter.placeholder}
                value={selectedFilters[filter.key] ?? ''}
                onChangeText={(value) =>
                  setSelectedFilters((current) => ({ ...current, [filter.key]: value }))
                }
                style={styles.filterTextInput}
              />
            ) : (
              <SelectFilter
                key={filter.key}
                filter={filter}
                value={selectedFilters[filter.key] ?? ''}
                onChange={(value) =>
                  setSelectedFilters((current) => ({ ...current, [filter.key]: value }))
                }
              />
            ),
          )}
          {filters.length ? (
            <Button mode="outlined" compact onPress={() => setSelectedFilters({})}>
              Reset filters
            </Button>
          ) : null}
          {showRefresh ? (
            <Button mode="outlined" compact icon="refresh" onPress={() => void fetchItems()} disabled={loading}>
              Refresh
            </Button>
          ) : null}
        </View>
      ) : null}
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

function SelectFilter({
  filter,
  value,
  onChange,
}: {
  filter: Extract<ListFilter, { type: 'select' }>;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const selectedLabel = filter.options.find((option) => option.value === value)?.label ?? filter.options[0]?.label ?? '';

  return (
    <View style={styles.selectFilter}>
      <Text variant="labelSmall" style={styles.selectLabel}>{filter.label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable onPress={() => setVisible(true)} accessibilityRole="button">
            <TextInput
              mode="outlined"
              dense
              editable={false}
              value={selectedLabel}
              right={<TextInput.Icon icon="menu-down" />}
              style={styles.filterTextInput}
            />
          </Pressable>
        }
      >
        {filter.options.map((option) => (
          <Menu.Item
            key={option.value || 'all'}
            title={option.label}
            onPress={() => {
              onChange(option.value);
              setVisible(false);
            }}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
  },
  filterTextInput: {
    minWidth: 150,
    flexGrow: 1,
  },
  selectFilter: {
    minWidth: 150,
    flexGrow: 1,
    gap: Spacing.one,
  },
  selectLabel: {
    paddingLeft: Spacing.one,
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
