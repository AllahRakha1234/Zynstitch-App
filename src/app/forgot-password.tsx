import { Link } from 'expo-router';
import { useFormik } from 'formik';
import { StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { requestPasswordReset } from '@/api';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { t } from '@/i18n/en';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { forgotPasswordSchema } from '@/validators/auth.validations';

export default function ForgotPasswordScreen() {
  const { showSuccess, showError } = useSnackbar();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, helpers) => {
      const response = await requestPasswordReset(values.email, 'en');
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
    <AuthScreen
      title="Forgot Password"
      description="Enter your email address and we will send you a link to reset your password."
      footer={
        <Link href="/login" style={styles.link}>
          Back to Sign In
        </Link>
      }
    >
      <TextInput
        mode="outlined"
        label="Email Address"
        autoCapitalize="none"
        keyboardType="email-address"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        error={formik.touched.email && Boolean(formik.errors.email)}
      />
      {formik.touched.email && formik.errors.email ? (
        <Text style={styles.error}>{formik.errors.email}</Text>
      ) : null}

      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
      >
        Send Reset Link
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
