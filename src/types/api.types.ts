export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  records: T[];
  total: number;
  limit: number;
  currentPage: number;
  totalPage: number;
}

// export type ApiError = {
//   message: string;
//   errors?: Record<string, string[]>;
//   status: number;
// };

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public success?: boolean
  ) {
    super(message);
    this.name = 'ApiError';
  }
}