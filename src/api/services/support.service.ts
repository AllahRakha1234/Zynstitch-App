import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { mockDelay } from '@/api/mock/delay';
import { env } from '@/config/env';
import type { ServiceResponse } from '@/types/serviceResponse.types';

export interface SupportEmailPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendSupportEmail(
  payload: SupportEmailPayload,
): Promise<ServiceResponse<null>> {
  if (env.useMockApi) {
    await mockDelay();
    return {
      success: true,
      message: 'Support request submitted successfully.',
      data: null,
    };
  }

  try {
    const { data } = await apiClient.post<ServiceResponse<null>>(
      endpoints.support.contact,
      payload,
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'Something went wrong. Please try again.'),
      data: null,
    };
  }
}
