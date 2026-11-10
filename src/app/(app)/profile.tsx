import { useFormik } from 'formik';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Text, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { changePassword, updateUserProfile } from '@/api';
import { PasswordField } from '@/components/shared/PasswordField';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { t } from '@/i18n/en';
import { useSession } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { changePasswordSchema } from '@/validators/auth.validations';

export default function ProfileScreen() {
  const colors = useTheme();
  const { user, updateUser } = useSession();
  const { showSuccess, showError } = useSnackbar();

  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name ?? '',
      companyName: user?.companyName ?? '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if (!user) return;
        const response = await updateUserProfile(user.id, values);
        if (!response.success || !response.data) {
          showError(response.message);
          return;
        }
        updateUser(response.data);
        showSuccess(t(response.message));
      } catch {
        showError('Failed to update profile.');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const passwordForm = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await changePassword(values.currentPassword, values.newPassword);
        if (!response.success) {
          showError(response.message);
          return;
        }
        showSuccess(t(response.message));
        helpers.resetForm();
      } catch {
        showError('Something went wrong. Please try again.');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <Avatar.Text
          size={56}
          label={(user?.name ?? 'U').charAt(0).toUpperCase()}
          style={{ backgroundColor: colors.primary }}
        />
        <View style={styles.accountCopy}>
          <Text variant="titleMedium">{user?.name || 'User'}</Text>
          <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
            {user?.email}
          </Text>
          <Text variant="labelMedium" style={{ color: colors.primary }}>
            {user?.role?.replace('_', ' ') ?? 'ADMIN'}
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <Text variant="titleLarge">Profile details</Text>
        <TextInput mode="outlined" label="Email" value={user?.email ?? ''} disabled />
        <TextInput
          mode="outlined"
          label="Name"
          value={profileForm.values.name}
          onChangeText={profileForm.handleChange('name')}
        />
        <TextInput
          mode="outlined"
          label="Company"
          value={profileForm.values.companyName}
          onChangeText={profileForm.handleChange('companyName')}
        />
        <Button
          mode="contained"
          onPress={() => profileForm.handleSubmit()}
          loading={profileForm.isSubmitting}
        >
          Save profile
        </Button>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <Text variant="titleLarge">Change password</Text>
        <PasswordField
          label="Current password"
          value={passwordForm.values.currentPassword}
          onChangeText={passwordForm.handleChange('currentPassword')}
        />
        <PasswordField
          label="New password"
          value={passwordForm.values.newPassword}
          onChangeText={passwordForm.handleChange('newPassword')}
        />
        <PasswordField
          label="Confirm password"
          value={passwordForm.values.confirmPassword}
          onChangeText={passwordForm.handleChange('confirmPassword')}
        />
        <Button
          mode="contained"
          onPress={() => passwordForm.handleSubmit()}
          loading={passwordForm.isSubmitting}
        >
          Update password
        </Button>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
  },
  accountCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  section: {
    padding: Spacing.three,
    gap: Spacing.two,
    borderRadius: 16,
    borderWidth: 1,
  },
});
