export type ExportEntity = 'customers' | 'measurements' | 'orders';

export interface ExportJob {
  _id?: string;
  ownerId?: string;
  entity: ExportEntity;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  fileKey?: string;
  fileName?: string;
  filters?: Record<string, unknown>;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ExportJobResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface CreateExportJobPayload {
  entity: ExportEntity;
  fileName?: string;
  filters?: Record<string, unknown>;
}
