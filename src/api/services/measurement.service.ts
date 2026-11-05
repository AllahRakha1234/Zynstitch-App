import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { mockMeasurements } from '@/api/mock/data';
import { mockDelay } from '@/api/mock/delay';
import { env } from '@/config/env';
import type { IMeasurement, MeasurementResponse } from '@/types/measurements.types';

export async function fetchAllMeasurements(
  page = 0,
  limit = 20,
  filters?: Record<string, string>,
): Promise<MeasurementResponse<{ measurements: IMeasurement[]; total: number }>> {
  if (env.useMockApi) {
    await mockDelay();
    const search = filters?.search?.toLowerCase().trim();
    let measurements = [...mockMeasurements];
    if (search) {
      measurements = measurements.filter(
        (m) =>
          m.measurementName.toLowerCase().includes(search) ||
          m.customerName?.toLowerCase().includes(search) ||
          m.customerPhone?.toLowerCase().includes(search),
      );
    }
    const total = measurements.length;
    const sliced =
      limit > 0 ? measurements.slice(page * limit, page * limit + limit) : measurements;
    return {
      success: true,
      data: { measurements: sliced, total },
      message: 'serviceMessages.fetchSuccess',
    };
  }

  try {
    const { data } = await apiClient.get<
      MeasurementResponse<{ measurements: IMeasurement[]; total: number }>
    >(endpoints.measurements.list, { params: { page, limit, ...filters } });
    return data;
  } catch (error) {
    return {
      success: false,
      data: { measurements: [], total: 0 },
      message: getErrorMessage(error, 'serviceMessages.fetchFail'),
    };
  }
}

export async function fetchMeasurementById(
  id: string,
): Promise<MeasurementResponse<IMeasurement>> {
  if (env.useMockApi) {
    await mockDelay();
    const measurement = mockMeasurements.find((m) => m._id === id) ?? null;
    return {
      success: Boolean(measurement),
      data: measurement,
      message: measurement ? 'serviceMessages.fetchSuccess' : 'serviceMessages.notFound',
    };
  }

  try {
    const { data } = await apiClient.get<MeasurementResponse<IMeasurement>>(
      endpoints.measurements.detail(id),
    );
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.fetchFail'),
    };
  }
}

export async function saveMeasurement(
  measurement: IMeasurement,
): Promise<MeasurementResponse<IMeasurement>> {
  if (env.useMockApi) {
    await mockDelay();
    const now = new Date().toISOString();
    if (measurement._id) {
      const index = mockMeasurements.findIndex((m) => m._id === measurement._id);
      if (index >= 0) {
        mockMeasurements[index] = {
          ...mockMeasurements[index],
          ...measurement,
          updatedAt: now,
        };
        return {
          success: true,
          data: mockMeasurements[index],
          message: 'serviceMessages.updateSuccess',
        };
      }
    }
    const created: IMeasurement = {
      ...measurement,
      _id: `meas-${Date.now()}`,
      ownerId: 'user-1',
      createdAt: now,
      updatedAt: now,
    };
    mockMeasurements.unshift(created);
    return {
      success: true,
      data: created,
      message: 'serviceMessages.createSuccess',
    };
  }

  try {
    const { data } = await apiClient.post<MeasurementResponse<IMeasurement>>(
      endpoints.measurements.list,
      measurement,
    );
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.saveFail'),
    };
  }
}

export async function deleteMeasurement(
  id: string,
): Promise<MeasurementResponse<null>> {
  if (env.useMockApi) {
    await mockDelay();
    const index = mockMeasurements.findIndex((m) => m._id === id);
    if (index >= 0) mockMeasurements.splice(index, 1);
    return { success: true, data: null, message: 'serviceMessages.deleteSuccess' };
  }

  try {
    const { data } = await apiClient.delete<MeasurementResponse<null>>(
      endpoints.measurements.detail(id),
    );
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.deleteFail'),
    };
  }
}
