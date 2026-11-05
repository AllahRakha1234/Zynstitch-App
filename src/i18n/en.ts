const messages: Record<string, string> = {
  'login.messages.loginSuccess': 'Login successful!',
  'login.messages.invalidCredentials': 'Invalid email or password',
  'login.messages.accountBlocked': 'Your account has been blocked. Please contact support.',
  'login.messages.unexpectedError': 'Something went wrong. Please try again.',
  'forgotPassword.messages.emailSent':
    'If an account exists for that email, a reset link has been sent.',
  'forgotPassword.messages.tooManyRequests':
    'Too many reset requests. Please wait a while and try again.',
  'forgotPassword.messages.unexpectedError': 'Something went wrong. Please try again.',
  'resetPassword.messages.success':
    'Your password has been reset. Please sign in with your new password.',
  'resetPassword.messages.invalidToken': 'This reset link is invalid or has already been used.',
  'resetPassword.messages.expiredToken': 'This reset link has expired. Please request a new one.',
  'resetPassword.messages.unexpectedError': 'Something went wrong. Please try again.',
  'profile.updateSuccess': 'Profile updated successfully.',
  'profile.updateError': 'Failed to update profile.',
  'profile.changePassword.messages.success': 'Password changed successfully.',
  'profile.changePassword.messages.incorrectCurrentPassword': 'Current password is incorrect.',
  'profile.changePassword.messages.unexpectedError': 'Something went wrong. Please try again.',
  'serviceMessages.fetchSuccess': 'Fetched successfully.',
  'serviceMessages.fetchFail': 'Failed to fetch data.',
  'serviceMessages.createSuccess': 'Created successfully.',
  'serviceMessages.updateSuccess': 'Updated successfully.',
  'serviceMessages.saveFail': 'Failed to save.',
  'serviceMessages.deleteSuccess': 'Deleted successfully.',
  'serviceMessages.deleteFail': 'Failed to delete.',
  'serviceMessages.notFound': 'Record not found.',
  'serviceMessages.exportJobCreated': 'Export job created.',
  'serviceMessages.exportJobCreateFail': 'Failed to create export job.',
};

export function t(key: string) {
  return messages[key] ?? key;
}
