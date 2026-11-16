import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { mockDelay } from '@/api/mock/delay';
import { MOCK_PASSWORD, mockProfile } from '@/api/mock/data';
import { env } from '@/config/env';
import type { ServiceResponse } from '@/types/serviceResponse.types';
import type { IUserProfile, LoginFormValues, LoginResponseData } from '@/types/users.types';

export async function login(
  payload: LoginFormValues,
): Promise<ServiceResponse<LoginResponseData>> {
  try {
    const { data } = await apiClient.post<ServiceResponse<LoginResponseData>>(
      endpoints.auth.login,
      payload,
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'login.messages.unexpectedError'),
      data: null,
    };
  }
}

export async function logout(): Promise<ServiceResponse<null>> {
  try {
    const { data } = await apiClient.post<ServiceResponse<null>>(endpoints.auth.logout);
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'Logout failed'),
      data: null,
    };
  }
}

export async function fetchCurrentUser(): Promise<ServiceResponse<IUserProfile>> {
  try {
    const { data } = await apiClient.get<ServiceResponse<IUserProfile>>(endpoints.auth.me);
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'Failed to fetch session'),
      data: null,
    };
  }
}

export async function requestPasswordReset(
  email: string,
  lang = 'en',
): Promise<ServiceResponse<null>> {
  if (env.useMockApi) {
    await mockDelay();
    return {
      success: true,
      message: 'forgotPassword.messages.emailSent',
      data: null,
    };
  }

  try {
    const { data } = await apiClient.post<ServiceResponse<null>>(
      endpoints.auth.forgotPassword,
      { email, lang },
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'forgotPassword.messages.unexpectedError'),
      data: null,
    };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<ServiceResponse<null>> {
  if (env.useMockApi) {
    await mockDelay();
    if (!token?.trim()) {
      return {
        success: false,
        message: 'resetPassword.messages.invalidToken',
        data: null,
      };
    }
    return {
      success: true,
      message: 'resetPassword.messages.success',
      data: null,
    };
  }

  try {
    const { data } = await apiClient.post<ServiceResponse<null>>(
      endpoints.auth.resetPassword,
      { token, newPassword },
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'resetPassword.messages.unexpectedError'),
      data: null,
    };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ServiceResponse<null>> {
  if (env.useMockApi) {
    await mockDelay();
    if (currentPassword !== MOCK_PASSWORD) {
      return {
        success: false,
        message: 'profile.changePassword.messages.incorrectCurrentPassword',
        data: null,
      };
    }
    return {
      success: true,
      message: 'profile.changePassword.messages.success',
      data: null,
    };
  }

  try {
    const { data } = await apiClient.post<ServiceResponse<null>>(
      endpoints.auth.changePassword,
      { currentPassword, newPassword },
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'profile.changePassword.messages.unexpectedError'),
      data: null,
    };
  }
}
