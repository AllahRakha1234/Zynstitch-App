import { useFormik } from 'formik';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { sendSupportEmail } from '@/api';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export function HomeContact() {
  const colors = useTheme();
  const { showSuccess, showError } = useSnackbar();

  const formik = useFormik<ContactFormValues>({
    initialValues: { name: '', email: '', message: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
      email: Yup.string().email('Enter a valid email address').required('Email is required'),
      message: Yup.string()
        .min(10, 'Message must be at least 10 characters')
        .required('Message is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const response = await sendSupportEmail(values);
        if (!response.success) {
          showError(response.message || 'Something went wrong. Please try again.');
          return;
        }

        helpers.resetForm();
        showSuccess('Support request submitted successfully.');
      } catch {
        showError('Something went wrong. Please try again.');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.outline },
        ]}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Contact Support
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.textSecondary }]}>
          Submit your request and our team will help you with setup, workflow, or any issues related
          to Zynstitch operations system.
        </Text>

        <TextInput
          mode="outlined"
          label="Your Name"
          placeholder="e.g. John Doe"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          error={formik.touched.name && Boolean(formik.errors.name)}
        />
        {formik.touched.name && formik.errors.name ? (
          <Text style={styles.error}>{formik.errors.name}</Text>
        ) : null}

        <TextInput
          mode="outlined"
          label="Email Address"
          placeholder="e.g. john@email.com"
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

        <TextInput
          mode="outlined"
          label="Message"
          placeholder="Describe your issue or request..."
          multiline
          numberOfLines={5}
          value={formik.values.message}
          onChangeText={formik.handleChange('message')}
          onBlur={formik.handleBlur('message')}
          error={formik.touched.message && Boolean(formik.errors.message)}
          style={styles.message}
        />
        {formik.touched.message && formik.errors.message ? (
          <Text style={styles.error}>{formik.errors.message}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={() => formik.handleSubmit()}
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          style={styles.submit}
        >
          Submit Request
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.two,
    lineHeight: 22,
  },
  message: {
    minHeight: 120,
  },
  error: {
    color: '#b3261e',
    fontSize: 12,
    marginTop: -4,
  },
  submit: {
    marginTop: Spacing.two,
    alignSelf: 'flex-start',
  },
});
