/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/types/api.types';
import axios, { AxiosRequestHeaders } from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
type FailedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
};

let failedQueue: FailedRequest[] = [];

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Retry the request with the new token
      if (token && prom.config.headers) {
        prom.config.headers.Authorization = `Bearer ${token}`;
      }
      prom.resolve(axiosInstance(prom.config));
    }
  });

  // Reset the queue
  failedQueue = [];
};

// Handle error messages centrally
const handleErrorResponse = (error: any) => {
  // Skip notification for refresh token requests
  if (
    error.config &&
    error.config.url &&
    error.config.url.includes('/refresh-token')
  ) {
    return;
  }

  const statusCode =
    error.statusCode || (error.response && error.response.status);

  if (statusCode === 400) {
    toast({
      title: 'Input Error',
      description: 'Periksa kembali data yang Anda masukkan',
      variant: 'destructive',
    });
  } else if (statusCode === 500) {
    toast({
      title: 'Server Error',
      description: 'Terjadi kesalahan pada server, silakan hubungi admin',
      variant: 'destructive',
    });
  } else if (statusCode === 401) {
    toast({
      title: 'Akses Ditolak',
      description:
        'Sesi Anda telah berakhir atau tidak memiliki izin yang cukup',
      variant: 'destructive',
    });
  } else if (statusCode === 404) {
    toast({
      title: 'Data Tidak Ditemukan',
      description: 'Data yang Anda cari tidak ditemukan',
      variant: 'destructive',
    });
  } else if (statusCode === 403) {
    toast({
      title: 'Akses Dibatasi',
      description: 'Anda tidak memiliki izin untuk mengakses resource ini',
      variant: 'destructive',
    });
  } else {
    // Fallback for other errors
    toast({
      title: 'Terjadi Kesalahan',
      description:
        'Terjadi kesalahan saat memproses permintaan Anda. Silahkan hubungi Admin',
      variant: 'destructive',
    });
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if no config or response, or if it's already a retry
    if (!originalRequest || !error.response || originalRequest._retry) {
      handleErrorResponse(error);
      return Promise.reject(error);
    }

    // Check if error is 401 (Unauthorized) and it's not a refresh token request
    if (
      error.response.status === 401 &&
      !originalRequest.url.includes('/refresh-token')
    ) {
      // Get refresh token from storage
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // No refresh token available, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(error);
      }

      // If we're not already refreshing
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          // Call your refresh token API
          const response = await axios.post(
            `${baseURL}/api/auth/refresh-token`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const responseData = response.data as {
            success: boolean;
            message?: string;
            data: { session: any };
          };
          if (!responseData.success) {
            const responseData = response.data as {
              success: boolean;
              message?: string;
              data: { session: any };
            };
            throw new Error(responseData.message || 'Failed to refresh token');
          }

          const { session } = (response.data as { data: { session: any } })
            .data;
          const { access_token, refresh_token, expires_at } = session;

          // Update tokens in localStorage
          localStorage.setItem('token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('expires_at', expires_at.toString());

          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          // Process the queue with the new token
          processQueue(null, access_token);

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Failed to refresh the token
          processQueue(refreshError);

          // Clear auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('expires_at');
          localStorage.removeItem('user');
          window.location.href = '/';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // We're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
    }

    if (error.response?.data) {
      const errorMessage = error.response.data.message || 'An error occurred';
      const customError = new ApiError(
        errorMessage,
        error.response.status,
        error.response.data.success
      );

      handleErrorResponse(customError);
      return Promise.reject(customError);
    }

    // For other errors, just pass them through
    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
