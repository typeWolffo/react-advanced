export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StreamChunk {
  type: 'text' | 'tool_call' | 'error' | 'end';
  content: string;
  metadata?: Record<string, any>;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
