import { Link, router } from 'expo-router';
import { useFormik } from 'formik';
import { StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { PasswordField } from '@/components/shared/PasswordField';
import { Spacing } from '@/constants/theme';
import { t } from '@/i18n/en';
import { useSession } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { loginSchema } from '@/validators/auth.validations';

export default function LoginScreen() {
  const { signIn } = useSession();
  const { showSuccess, showError } = useSnackbar();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, helpers) => {
      const result = await signIn(values);
      if (!result.success) {
        showError(result.message);
        helpers.setSubmitting(false);
        return;
      }
      showSuccess(t(result.message));
      helpers.setSubmitting(false);
      router.replace('/');
    },
  });

  return (
    <AuthScreen title="Sign In">
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

      <PasswordField
        label="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        error={formik.touched.password && Boolean(formik.errors.password)}
      />
      {formik.touched.password && formik.errors.password ? (
        <Text style={styles.error}>{formik.errors.password}</Text>
      ) : null}

      <Link href="/forgot-password" style={styles.link}>
        Forgot Password
      </Link>

      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
      >
        Login
      </Button>

      <Text variant="bodySmall" style={styles.hint}>
        Demo: admin@zynstitch.com / password
      </Text>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: '#b3261e',
    marginTop: -8,
  },
  link: {
    alignSelf: 'flex-end',
    color: '#1565c0',
  },
  hint: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: Spacing.one,
  },
});
