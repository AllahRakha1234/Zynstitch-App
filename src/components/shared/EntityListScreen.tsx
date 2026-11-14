import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, IconButton, Menu, Text, TextInput } from 'react-native-paper';
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
  const { width: screenWidth } = useWindowDimensions();
  const filterFieldWidth = screenWidth < 600 ? '100%' : 220;
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
        <View style={[styles.filterPanel, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <View style={styles.filterFields}>
            {filters.map((filter) =>
              filter.type === 'text' ? (
                <TextInput
                  key={filter.key}
                  mode="outlined"
                  label={filter.label}
                  placeholder={filter.placeholder}
                  value={selectedFilters[filter.key] ?? ''}
                  onChangeText={(value) =>
                    setSelectedFilters((current) => ({ ...current, [filter.key]: value }))
                  }
                  style={[styles.filterTextInput, { width: filterFieldWidth }]}
                />
              ) : (
                <SelectFilter
                  key={filter.key}
                  filter={filter}
                  value={selectedFilters[filter.key] ?? ''}
                  width={filterFieldWidth}
                  onChange={(value) =>
                    setSelectedFilters((current) => ({ ...current, [filter.key]: value }))
                  }
                />
              ),
            )}
          </View>
          <View style={styles.filterActions}>
            {filters.length ? (
              <Button mode="outlined" onPress={() => setSelectedFilters({})} style={styles.resetButton}>
                Reset filters
              </Button>
            ) : null}
            {showRefresh ? (
              <IconButton
                icon="refresh"
                mode="outlined"
                accessibilityLabel="Refresh records"
                onPress={() => void fetchItems()}
                disabled={loading}
              />
            ) : null}
          </View>
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
  width,
  onChange,
}: {
  filter: Extract<ListFilter, { type: 'select' }>;
  value: string;
  width: number | `${number}%`;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const selectedLabel = filter.options.find((option) => option.value === value)?.label ?? filter.options[0]?.label ?? '';

  return (
    <View style={[styles.selectFilter, { width }]}>
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
              style={[styles.filterTextInput, { width }]}
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
  filterPanel: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
    zIndex: 2,
    elevation: 2,
  },
  filterFields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  filterTextInput: {
    height: 56,
  },
  selectFilter: {
    gap: Spacing.one,
  },
  selectLabel: {
    paddingLeft: Spacing.one,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.two,
  },
  resetButton: {
    minHeight: 40,
    justifyContent: 'center',
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
