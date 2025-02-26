// Auth endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: '/api/auth/signin',
    LOGOUT: '/api/auth/signout',
    CURRENT_USER: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    UPDATE_PROFILE: '/api/auth/updateProfile',
    VERIFY_EMAIL: '/api/auth/verifyEmail',
  };
  
  // Employee endpoints
  export const EMPLOYEE_ENDPOINTS = {
    GET_ALL: '/api/employee',
    GET_DETAIL: (id: string) => `/api/employee/${id}`,
    CREATE: '/api/employee',
    UPDATE: (id: string) => `/api/employee/${id}`,
    DELETE: (id: string) => `/api/employee/${id}`,
  };
  
  // Location endpoints
  export const LOCATION_ENDPOINTS = {
    GET_ALL: '/api/locations',
    GET_DETAIL: (id: string) => `/api/locations/${id}`,
    CREATE: '/api/locations',
    UPDATE: (id: string) => `/api/locations/${id}`,
    DELETE: (id: string) => `/api/locations/${id}`,
  };
  
  // Merchant endpoints
  export const MERCHANT_ENDPOINTS = {
    GET_ALL: '/api/merchants',
    GET_DETAIL: (id: string) => `/api/merchants/${id}`,
    CREATE: '/api/merchants',
    UPDATE: (id: string) => `/api/merchants/${id}`,
    DELETE: (id: string) => `/api/merchants/${id}`,
  };
  
  // Dashboard endpoints
  export const DASHBOARD_ENDPOINTS = {
    TARGET_INCOME: '/api/dashboard/target-income',
    TOP_EARNERS: '/api/dashboard/top-earners',
    ACHIEVEMENT: '/api/dashboard/achievement',
    CHART_INCOME: '/api/dashboard/chart-income',
    MAPS: '/api/dashboard/maps',
  };
  
  // Collector deposit endpoints
  export const COLLECTOR_DEPOSIT_ENDPOINTS = {
    GET_ALL: '/api/collector-deposits',
    GET_DETAIL: (id: string) => `/api/collector-deposits/${id}`,
    CREATE: '/api/collector-deposits',
    UPDATE: (id: string) => `/api/collector-deposits/${id}`,
  };
  
  // Manager deposit endpoints
  export const MANAGER_DEPOSIT_ENDPOINTS = {
    GET_ALL: '/api/manager-deposits',
    GET_DETAIL: (id: string) => `/api/manager-deposits/${id}`,
    CREATE: '/api/manager-deposits',
    UPDATE: (id: string) => `/api/manager-deposits/${id}`,
  };
  
  // Bank deposit endpoints
  export const BANK_DEPOSIT_ENDPOINTS = {
    GET_ALL: '/api/bank-deposits',
    GET_DETAIL: (id: string) => `/api/bank-deposits/${id}`,
    CREATE: '/api/bank-deposits',
    UPDATE: (id: string) => `/api/bank-deposits/${id}`,
  };