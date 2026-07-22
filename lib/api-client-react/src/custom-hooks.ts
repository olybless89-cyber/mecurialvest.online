/**
 * Custom hooks for features not covered by orval-generated code.
 * Follows the same pattern as the generated api.ts.
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { customFetch } from './custom-fetch';

// ─── PIN ────────────────────────────────────────────────────────────────────

export const getPinStatusQueryKey = () => ['/api/profile/pin/status'] as const;

export const useGetPinStatus = <TData = { success: boolean; data: { pinSet: boolean } }, TError = unknown>(
  options?: UseQueryOptions<TData, TError>,
) =>
  useQuery<TData, TError>({
    queryKey: getPinStatusQueryKey(),
    queryFn: () => customFetch<TData>('/api/profile/pin/status'),
    ...options,
  });

export const useSetPin = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<unknown, TError, { pin: string; confirmPin: string; password?: string; oldPin?: string }, TContext>,
) =>
  useMutation<unknown, TError, { pin: string; confirmPin: string; password?: string; oldPin?: string }, TContext>({
    mutationFn: (data) =>
      customFetch('/api/profile/pin/set', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });

// ─── ADMIN: Send Payment ─────────────────────────────────────────────────────

export const useSendPayment = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<unknown, TError, {
    accountId: number; amount: string; description?: string;
    hold?: boolean; holdReason?: string; cotAmount?: string; taxAmount?: string; chargesNote?: string;
  }, TContext>,
) =>
  useMutation({
    mutationFn: (data) =>
      customFetch('/api/admin/send-payment', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });

// ─── ADMIN: Held Transactions ─────────────────────────────────────────────────

export const getHeldTransactionsQueryKey = () => ['/api/admin/held-transactions'] as const;

export const useGetHeldTransactions = <TData = any, TError = unknown>(
  options?: UseQueryOptions<TData, TError>,
) =>
  useQuery<TData, TError>({
    queryKey: getHeldTransactionsQueryKey(),
    queryFn: () => customFetch<TData>('/api/admin/held-transactions'),
    ...options,
  });

export const useHoldTransaction = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<unknown, TError, { id: number; holdReason?: string }, TContext>,
) =>
  useMutation({
    mutationFn: ({ id, ...data }) =>
      customFetch(`/api/admin/transactions/${id}/hold`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });

export const useReleaseTransaction = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<unknown, TError, { id: number }, TContext>,
) =>
  useMutation({
    mutationFn: ({ id }) =>
      customFetch(`/api/admin/transactions/${id}/release`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });

export const useSetCharges = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<unknown, TError, {
    id: number; cotAmount?: string | null; taxAmount?: string | null;
    chargesNote?: string; cotPaid?: boolean; taxPaid?: boolean;
  }, TContext>,
) =>
  useMutation({
    mutationFn: ({ id, ...data }) =>
      customFetch(`/api/admin/transactions/${id}/set-charges`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });

// ─── ADMIN: Account Suspend / Unsuspend ──────────────────────────────────────

export const useSuspendAccount = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<unknown, TError, { id: number }, TContext>,
) =>
  useMutation({
    mutationFn: ({ id }) =>
      customFetch(`/api/admin/accounts/${id}/suspend`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });

export const useUnsuspendAccount = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<unknown, TError, { id: number }, TContext>,
) =>
  useMutation({
    mutationFn: ({ id }) =>
      customFetch(`/api/admin/accounts/${id}/unsuspend`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }),
    ...options,
  });

// ─── ADMIN: Get user accounts ─────────────────────────────────────────────────

// POST /api/admin/users/:id/reset-pin
export const useResetUserPin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      customFetch(`/api/admin/users/${userId}/reset-pin`, { method: 'POST' }),
    onSuccess: (_: any, userId: number) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${userId}`] });
    },
  });
};

export const getAdminUserAccountsQueryKey = (userId: number) => [`/api/admin/users/${userId}/accounts`] as const;

export const useGetAdminUserAccounts = <TData = any, TError = unknown>(
  userId: number,
  options?: UseQueryOptions<TData, TError>,
) =>
  useQuery<TData, TError>({
    queryKey: getAdminUserAccountsQueryKey(userId),
    queryFn: () => customFetch<TData>(`/api/admin/users/${userId}`),
    enabled: !!userId,
    ...options,
  });
