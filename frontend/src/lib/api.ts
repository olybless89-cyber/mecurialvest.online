import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: { resolve: (t: string) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => { error ? prom.reject(error) : prom.resolve(token!); });
  failedQueue = [];
};

// Request interceptor — attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401 and refresh
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    if (original.url?.includes('/auth/refresh') || original.url?.includes('/auth/login')) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }).catch((e) => Promise.reject(e));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post('/auth/refresh');
      const newToken = data.data?.accessToken;
      if (newToken) {
        useAuthStore.getState().setAccessToken(newToken);
        useAuthStore.getState().setUser(data.data?.user || {});
        original.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(original);
      }
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) => api.post('/auth/reset-password', data),
  resendVerification: (email: string) => api.post('/auth/resend-verification', { email }),
};

// Accounts
export const accountApi = {
  getAll: () => api.get('/accounts'),
  getStats: () => api.get('/accounts/stats'),
  getById: (id: string) => api.get(`/accounts/${id}`),
  create: (data: { type: string; nickname?: string; currency?: string }) => api.post('/accounts', data),
  update: (id: string, data: { nickname?: string; isDefault?: boolean }) => api.patch(`/accounts/${id}`, data),
  freeze: (id: string) => api.post(`/accounts/${id}/freeze`),
  unfreeze: (id: string) => api.post(`/accounts/${id}/unfreeze`),
  getTransactions: (id: string, params?: Record<string, string>) =>
    api.get(`/accounts/${id}/transactions`, { params }),
};

// Transactions
export const transactionApi = {
  getAll: (params?: Record<string, string>) => api.get('/transactions', { params }),
  getById: (id: string) => api.get(`/transactions/${id}`),
  getSummary: (period?: string) => api.get('/transactions/summary', { params: { period } }),
  getSpendingTrend: (months?: string) => api.get('/transactions/trend', { params: { months } }),
  export: (params?: Record<string, string>) =>
    api.get('/transactions/export', { params, responseType: 'blob' }),
};

// Transfers
export const transferApi = {
  initiate: (data: { fromAccountId: string; toAccountNumber: string; amount: string; note?: string }) =>
    api.post('/transfers', data),
  getAll: (params?: Record<string, string>) => api.get('/transfers', { params }),
};

// Beneficiaries
export const beneficiaryApi = {
  getAll: () => api.get('/beneficiaries'),
  add: (data: { name: string; accountNumber: string; bankName: string; bankCode?: string; nickname?: string }) =>
    api.post('/beneficiaries', data),
  update: (id: string, data: { name?: string; nickname?: string; bankName?: string }) =>
    api.patch(`/beneficiaries/${id}`, data),
  delete: (id: string) => api.delete(`/beneficiaries/${id}`),
};

// Notifications
export const notificationApi = {
  getAll: (params?: Record<string, string>) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Profile
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: { firstName?: string; lastName?: string; phone?: string }) => api.patch('/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/profile/change-password', data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.post('/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteAvatar: () => api.delete('/profile/avatar'),
};

// Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: Record<string, string>) => api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: { isActive?: boolean; role?: string }) =>
    api.patch(`/admin/users/${id}`, data),
  getTransactions: (params?: Record<string, string>) => api.get('/admin/transactions', { params }),
  reverseTransaction: (id: string, reason: string) =>
    api.post(`/admin/transactions/${id}/reverse`, { reason }),
  getAuditLogs: (params?: Record<string, string>) => api.get('/admin/audit-logs', { params }),
};
