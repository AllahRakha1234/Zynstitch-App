import { Link, router, useLocalSearchParams } from 'expo-router';
import { useFormik } from 'formik';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { resetPassword } from '@/api';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { PasswordField } from '@/components/shared/PasswordField';
import { t } from '@/i18n/en';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { resetPasswordSchema } from '@/validators/auth.validations';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { showSuccess, showError } = useSnackbar();

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, helpers) => {
      const response = await resetPassword(token ?? '', values.password);
      if (!response.success) {
        showError(response.message);
        helpers.setSubmitting(false);
        return;
      }
      showSuccess(t(response.message));
      helpers.setSubmitting(false);
      router.replace('/login');
    },
  });

  return (
    <AuthScreen
      title="Reset Password"
      description="Enter your new password below."
      footer={
        <Link href="/login" style={styles.link}>
          Back to Sign In
        </Link>
      }
    >
      <PasswordField
        label="New Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        error={formik.touched.password && Boolean(formik.errors.password)}
      />
      {formik.touched.password && formik.errors.password ? (
        <Text style={styles.error}>{formik.errors.password}</Text>
      ) : null}

      <PasswordField
        label="Confirm Password"
        value={formik.values.confirmPassword}
        onChangeText={formik.handleChange('confirmPassword')}
        onBlur={formik.handleBlur('confirmPassword')}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        <Text style={styles.error}>{formik.errors.confirmPassword}</Text>
      ) : null}

      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
      >
        Reset Password
      </Button>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: '#b3261e',
    marginTop: -8,
  },
  link: {
    textAlign: 'center',
    color: '#1565c0',
  },
});
