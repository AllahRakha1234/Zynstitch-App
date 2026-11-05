import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { mockJobs } from '@/api/mock/data';
import { mockDelay } from '@/api/mock/delay';
import { env } from '@/config/env';
import type {
  CreateExportJobPayload,
  ExportJob,
  ExportJobResponse,
} from '@/types/jobs.types';

export async function createJob(
  payload: CreateExportJobPayload,
): Promise<ExportJobResponse<{ jobId: string }>> {
  if (env.useMockApi) {
    await mockDelay();
    const now = new Date().toISOString();
    const finalFileName = payload.fileName?.trim()
      ? `${payload.fileName.trim()}.xlsx`
      : `${payload.entity}_${now.split('T')[0]}.xlsx`;
    const job: ExportJob = {
      _id: `job-${Date.now()}`,
      ownerId: 'user-1',
      entity: payload.entity,
      status: 'PROCESSING',
      fileName: finalFileName,
      filters: payload.filters ?? {},
      createdAt: now,
    };
    mockJobs.unshift(job);
    return {
      success: true,
      data: { jobId: job._id! },
      message: 'serviceMessages.exportJobCreated',
    };
  }

  try {
    const { data } = await apiClient.post<ExportJobResponse<{ jobId: string }>>(
      endpoints.jobs.create,
      payload,
    );
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.exportJobCreateFail'),
    };
  }
}

export async function fetchJobs(
  page = 0,
  limit = 20,
  filters?: Record<string, string>,
): Promise<ExportJobResponse<{ jobs: ExportJob[]; total: number }>> {
  if (env.useMockApi) {
    await mockDelay();
    const search = filters?.search?.toLowerCase().trim();
    let jobs = [...mockJobs];
    if (search) {
      jobs = jobs.filter(
        (j) =>
          j.fileName?.toLowerCase().includes(search) ||
          j.entity.toLowerCase().includes(search),
      );
    }
    const total = jobs.length;
    const sliced = limit > 0 ? jobs.slice(page * limit, page * limit + limit) : jobs;
    return {
      success: true,
      data: { jobs: sliced, total },
      message: 'serviceMessages.fetchSuccess',
    };
  }

  try {
    const { data } = await apiClient.get<
      ExportJobResponse<{ jobs: ExportJob[]; total: number }>
    >(endpoints.jobs.list, { params: { page, limit, ...filters } });
    return data;
  } catch (error) {
    return {
      success: false,
      data: { jobs: [], total: 0 },
      message: getErrorMessage(error, 'serviceMessages.fetchFail'),
    };
  }
}
