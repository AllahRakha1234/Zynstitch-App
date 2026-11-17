import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    View,
    type KeyboardTypeOptions,
} from 'react-native';
import {
    Button,
    Dialog,
    IconButton,
    Menu,
    Portal,
    Searchbar,
    Switch,
    Text,
    TextInput,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackArrowButton } from '@/components/shared/BackArrowButton';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSnackbar } from '@/providers/SnackbarProvider';

type CollectionRow = Record<string, unknown>;
type FormField = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'password' | 'select' | 'toggle';
  required?: boolean;
  hideOnEdit?: boolean;
  defaultValue?: string | boolean;
  options?: { label: string; value: string }[];
};
type TableColumn = {
  key: string;
  label: string;
  width?: number;
};
type RemoteListResult = {
  success: boolean;
  message: string;
  items: readonly object[];
  total: number;
};
type RemoteMutationResult = {
  success: boolean;
  message: string;
  data: object | null;
};

type Props = {
  title: string;
  singularTitle: string;
  entity: string;
  initialData: readonly object[];
  fields: FormField[];
  columns: TableColumn[];
  canAdd?: boolean;
  canExport?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  prepareRow?: (values: CollectionRow, existing: CollectionRow | null) => CollectionRow;
  loadRows?: (search: string) => Promise<RemoteListResult>;
  saveRowRemote?: (values: CollectionRow, existing: CollectionRow | null) => Promise<RemoteMutationResult>;
  deleteRowRemote?: (id: string) => Promise<RemoteMutationResult>;
};

const ACTIONS_WIDTH = 156;
const DEFAULT_COLUMN_WIDTH = 150;

export function CollectionTableScreen({
  title,
  singularTitle,
  entity,
  initialData,
  fields,
  columns,
  canAdd = true,
  canExport = true,
  canEdit = true,
  canDelete = true,
  canView = true,
  prepareRow,
  loadRows,
  saveRowRemote,
  deleteRowRemote,
}: Props) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { showSuccess, showError } = useSnackbar();
  const [rows, setRows] = useState<CollectionRow[]>(() =>
    loadRows ? [] : initialData.map((item) => ({ ...item })),
  );
  const [total, setTotal] = useState(initialData.length);
  const [loading, setLoading] = useState(Boolean(loadRows));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editingRow, setEditingRow] = useState<CollectionRow | null>(null);
  const [viewingRow, setViewingRow] = useState<CollectionRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
  const [saving, setSaving] = useState(false);

  const tableWidth = columns.reduce((total, column) => total + (column.width ?? DEFAULT_COLUMN_WIDTH), 0) + ACTIONS_WIDTH;
  const filteredRows = useMemo(() => {
    if (loadRows) return rows;
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(query)),
    );
  }, [columns, loadRows, rows, search]);

  const refreshRows = useCallback(async () => {
    if (!loadRows) return;
    setLoading(true);
    setLoadError(null);
    try {
      const response = await loadRows(search.trim());
      if (!response.success) {
        setLoadError(response.message || `Unable to load ${title.toLowerCase()}.`);
        return;
      }
      setRows(response.items.map((row) => ({ ...row })));
      setTotal(response.total);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : `Unable to load ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [loadRows, search, title]);

  useEffect(() => {
    if (!loadRows) return;
    const timer = setTimeout(() => void refreshRows(), 250);
    return () => clearTimeout(timer);
  }, [loadRows, refreshRows]);

  const openCreate = () => {
    setEditingRow(null);
    setFormValues(
      Object.fromEntries(
        fields
          .filter((field) => !field.hideOnEdit)
          .map((field) => [
            field.key,
            entity === 'orders' && field.key === 'orderNumber'
              ? `ORD-${1001 + rows.length}`
              : field.defaultValue ?? (field.type === 'toggle' ? false : ''),
          ]),
      ),
    );
  };

  const openEdit = (row: CollectionRow) => {
    setEditingRow(row);
    setFormValues(
      Object.fromEntries(
        fields
          .filter((field) => !field.hideOnEdit)
          .map((field) => [field.key, (row[field.key] as string | boolean | undefined) ?? field.defaultValue ?? '']),
      ),
    );
  };

  const closeForm = () => {
    if (saving) return;
    setEditingRow(null);
    setFormValues({});
  };

  const saveRow = async () => {
    const missing = fields.find((field) => field.required && !field.hideOnEdit && !String(formValues[field.key] ?? '').trim());
    if (missing) {
      showError(`${missing.label} is required.`);
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const convertedValues = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => {
        const field = fields.find((candidate) => candidate.key === key);
        if (field?.type === 'number') return [key, String(value).trim() ? Number(value) : 0];
        return [key, value];
      }),
    );
    const localSaved: CollectionRow = {
      ...(editingRow ?? {}),
      ...convertedValues,
      _id: editingRow?._id ?? `${entity}-${Date.now()}-${rows.length}`,
      ownerId: editingRow?.ownerId ?? 'user-1',
      createdAt: editingRow?.createdAt ?? now,
      updatedAt: now,
      ...(prepareRow?.(convertedValues, editingRow) ?? convertedValues),
    };

    let saved = localSaved;
    if (saveRowRemote) {
      try {
        const response = await saveRowRemote(convertedValues, editingRow);
        if (!response.success || !response.data) {
          showError(response.message || `Unable to save ${singularTitle.toLowerCase()}.`);
          setSaving(false);
          return;
        }
        saved = response.data as CollectionRow;
      } catch (error) {
        showError(error instanceof Error ? error.message : `Unable to save ${singularTitle.toLowerCase()}.`);
        setSaving(false);
        return;
      }
    }

    setRows((current) =>
      editingRow
        ? current.map((row) => (row._id === editingRow._id ? saved : row))
        : [saved, ...current],
    );
    setSaving(false);
    setEditingRow(null);
    setFormValues({});
    setTotal((current) => (editingRow ? current : current + 1));
    showSuccess(`${singularTitle} ${editingRow ? 'updated' : 'added'} successfully.`);
    if (saveRowRemote && !editingRow) void refreshRows();
  };

  const removeRow = (row: CollectionRow) => {
    Alert.alert(`Delete ${singularTitle.toLowerCase()}?`, 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (deleteRowRemote && typeof row._id === 'string') {
            try {
              const response = await deleteRowRemote(row._id);
              if (!response.success) {
                showError(response.message || `Unable to delete ${singularTitle.toLowerCase()}.`);
                return;
              }
            } catch (error) {
              showError(error instanceof Error ? error.message : `Unable to delete ${singularTitle.toLowerCase()}.`);
              return;
            }
          }
          setRows((current) => current.filter((item) => item._id !== row._id));
          setTotal((current) => Math.max(0, current - 1));
          showSuccess(`${singularTitle} deleted.`);
          if (deleteRowRemote) void refreshRows();
        },
      },
    ]);
  };

  const exportRows = async () => {
    try {
      const headers = columns.map((column) => column.label);
      const csvRows = filteredRows.map((row) =>
        columns.map((column) => csvValue(row[column.key])).join(','),
      );
      await Share.share({
        title: `Export ${title}`,
        message: [headers.map(csvValue).join(','), ...csvRows].join('\n'),
      });
    } catch {
      showError(`Unable to export ${title.toLowerCase()}.`);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.two }}>
          <BackArrowButton fallbackHref="/" />
          <View style={styles.titleCopy}>
            <Text variant="headlineSmall" style={styles.title}>{title}</Text>
            <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
              {filteredRows.length} of {total} records
            </Text>
          </View>
        </View>

        <View style={[styles.headerActions, { marginBottom: Spacing.two }]}>
          {canExport ? (
            <Button mode="outlined" icon="download-outline" onPress={() => void exportRows()} compact>
              Export
            </Button>
          ) : null}
          {canAdd ? (
            <Button mode="contained" icon="plus" onPress={openCreate} compact>
              Add {singularTitle}
            </Button>
          ) : null}
        </View>
      </View>

      <Searchbar
        placeholder={`Search ${title.toLowerCase()}`}
        value={search}
        onChangeText={setSearch}
        style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.outline }]}
      />
      {loading ? <Text style={styles.loadState}>Loading {title.toLowerCase()}…</Text> : null}
      {loadError ? <Text style={styles.loadError}>{loadError}</Text> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={[styles.table, { width: tableWidth, borderColor: colors.outline, backgroundColor: colors.surface }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.backgroundSelected, borderBottomColor: colors.outline }]}>
            {columns.map((column) => (
              <Text
                key={column.key}
                variant="labelLarge"
                numberOfLines={1}
                style={[styles.headerCell, { width: column.width ?? DEFAULT_COLUMN_WIDTH, color: colors.text }]}
              >
                {column.label}
              </Text>
            ))}
            <Text variant="labelLarge" style={[styles.headerCell, { width: ACTIONS_WIDTH, color: colors.text }]}>
              Actions
            </Text>
          </View>
          <ScrollView style={styles.tableBody} nestedScrollEnabled>
            {filteredRows.length ? filteredRows.map((row, rowIndex) => (
              <View
                key={String(row._id ?? rowIndex)}
                style={[styles.tableRow, { borderBottomColor: colors.outline }]}
              >
                {columns.map((column) => (
                  column.key === 'status' ? (
                    <View key={column.key} style={[styles.cell, styles.statusCell, { width: column.width ?? DEFAULT_COLUMN_WIDTH }]}>
                      <StatusBadge value={String(row[column.key] ?? '')} />
                    </View>
                  ) : (
                    <Text
                      key={column.key}
                      variant="bodySmall"
                      numberOfLines={2}
                      style={[styles.cell, { width: column.width ?? DEFAULT_COLUMN_WIDTH, color: colors.text }]}
                    >
                      {displayValue(row[column.key])}
                    </Text>
                  )
                ))}
                <View style={[styles.rowActions, { width: ACTIONS_WIDTH }]}>
                  {canView ? (
                    <IconButton icon="eye-outline" size={19} accessibilityLabel={`View ${singularTitle}`} onPress={() => setViewingRow(row)} />
                  ) : null}
                  {canEdit ? (
                    <IconButton icon="pencil-outline" size={19} accessibilityLabel={`Edit ${singularTitle}`} onPress={() => openEdit(row)} />
                  ) : null}
                  {canDelete ? (
                    <IconButton icon="delete-outline" size={19} iconColor="#b3261e" accessibilityLabel={`Delete ${singularTitle}`} onPress={() => removeRow(row)} />
                  ) : null}
                </View>
              </View>
            )) : (
              <View style={styles.emptyRow}>
                <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                  No {title.toLowerCase()} found.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={Boolean(editingRow) || Object.keys(formValues).length > 0} onDismiss={closeForm}>
          <Dialog.Title>{editingRow ? `Edit ${singularTitle}` : `Add ${singularTitle}`}</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView contentContainerStyle={styles.formFields}>
              {fields
                .filter((field) => !(editingRow && field.hideOnEdit))
                .map((field) => (
                  <FormFieldInput
                    key={field.key}
                    field={field}
                    value={formValues[field.key] ?? ''}
                    onChange={(value) => setFormValues((current) => ({ ...current, [field.key]: value }))}
                  />
                ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={closeForm} disabled={saving}>Cancel</Button>
            <Button mode="contained" onPress={saveRow} loading={saving}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={Boolean(viewingRow)} onDismiss={() => setViewingRow(null)}>
          <Dialog.Title>{singularTitle} details</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView contentContainerStyle={styles.detailFields}>
              {columns.filter((column) => column.key !== 'actions').map((column) => (
                <View key={column.key} style={styles.detailRow}>
                  <Text variant="labelMedium" style={{ color: colors.textSecondary }}>{column.label}</Text>
                  <Text variant="bodyMedium" selectable>{displayValue(viewingRow?.[column.key])}</Text>
                </View>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setViewingRow(null)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function FormFieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  if (field.type === 'toggle') {
    return (
      <View style={styles.toggleField}>
        <Text variant="bodyMedium" style={{ flex: 1 }}>{field.label}</Text>
        <Switch value={Boolean(value)} onValueChange={onChange} />
      </View>
    );
  }

  if (field.type === 'select') {
    const selected = field.options?.find((option) => option.value === value);
    return (
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Pressable onPress={() => setMenuVisible(true)}>
            <TextInput
              mode="outlined"
              label={field.label}
              value={selected?.label ?? ''}
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
            />
          </Pressable>
        }
      >
        {field.options?.map((option) => (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => {
              onChange(option.value);
              setMenuVisible(false);
            }}
          />
        ))}
      </Menu>
    );
  }

  const keyboardType: KeyboardTypeOptions = field.type === 'number' ? 'decimal-pad' : 'default';
  return (
    <TextInput
      mode="outlined"
      label={field.label}
      value={String(value)}
      onChangeText={onChange}
      keyboardType={keyboardType}
      secureTextEntry={field.type === 'password'}
      autoCapitalize={field.key === 'email' ? 'none' : 'sentences'}
    />
  );
}

function csvValue(value: unknown) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function displayValue(value: unknown) {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const palette = normalized === 'completed' || normalized === 'active'
    ? { background: '#e8f5e9', text: '#2e7d32' }
    : normalized === 'failed' || normalized === 'blocked'
      ? { background: '#ffebee', text: '#b3261e' }
      : normalized === 'pending' || normalized === 'processing'
        ? { background: '#fff3e0', text: '#ed6c02' }
        : normalized === 'in_progress'
          ? { background: '#e3f2fd', text: '#1565c0' }
          : { background: '#eceff1', text: '#455a64' };

  return (
    <View style={[styles.statusBadge, { backgroundColor: palette.background }]}>
      <Text variant="labelSmall" style={{ color: palette.text, fontWeight: '700' }}>
        {value.replaceAll('_', ' ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  pageHeader: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.one, gap: Spacing.two, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' },
  pageTitleGroup: { flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0, justifyContent: 'flex-start', width: '100%', gap: Spacing.two },
  titleCopy: { gap: 2 },
  title: { fontWeight: '700' },
  headerActions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  search: { marginHorizontal: Spacing.three, marginBottom: Spacing.three, borderWidth: StyleSheet.hairlineWidth },
  loadState: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.two },
  loadError: { color: '#b3261e', paddingHorizontal: Spacing.three, paddingBottom: Spacing.two },
  table: { borderWidth: 1, borderRadius: 12, marginHorizontal: Spacing.three, marginBottom: Spacing.four, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', minHeight: 48, borderBottomWidth: 1, alignItems: 'center' },
  headerCell: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.two, fontWeight: '700' },
  tableBody: { maxHeight: 520 },
  tableRow: { flexDirection: 'row', minHeight: 60, borderBottomWidth: StyleSheet.hairlineWidth, alignItems: 'center' },
  cell: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  statusCell: { alignItems: 'flex-start' },
  statusBadge: { borderRadius: 999, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  rowActions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  emptyRow: { minHeight: 90, justifyContent: 'center', alignItems: 'center' },
  dialogScrollArea: { maxHeight: 520 },
  formFields: { gap: Spacing.three, paddingVertical: Spacing.two },
  detailFields: { gap: Spacing.three, paddingVertical: Spacing.three },
  detailRow: { gap: Spacing.one },
  toggleField: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
