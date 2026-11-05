import { useFormik } from 'formik';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { changePassword, updateUserProfile } from '@/api';
import { PasswordField } from '@/components/shared/PasswordField';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n/en';
import { useTheme } from '@/hooks/use-theme';
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
      if (!user) return;
      const response = await updateUserProfile(user.id, values);
      if (!response.success || !response.data) {
        showError(response.message);
        helpers.setSubmitting(false);
        return;
      }
      updateUser(response.data);
      showSuccess(t(response.message));
      helpers.setSubmitting(false);
    },
  });

  const passwordForm = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, helpers) => {
      const response = await changePassword(values.currentPassword, values.newPassword);
      if (!response.success) {
        showError(response.message);
        helpers.setSubmitting(false);
        return;
      }
      showSuccess(t(response.message));
      helpers.resetForm();
      helpers.setSubmitting(false);
    },
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="titleLarge">Profile</Text>
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

      <Divider style={styles.divider} />
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
  },
  divider: {
    marginVertical: Spacing.two,
  },
});
