import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { extractError } from '@/lib/utils';

export const useAccounts = () =>
  useQuery({ queryKey: ['accounts'], queryFn: async () => { const { data } = await accountApi.getAll(); return data.data; } });

export const useAccountStats = () =>
  useQuery({ queryKey: ['account-stats'], queryFn: async () => { const { data } = await accountApi.getStats(); return data.data; } });

export const useAccount = (id: string) =>
  useQuery({ queryKey: ['account', id], queryFn: async () => { const { data } = await accountApi.getById(id); return data.data; }, enabled: !!id });

export const useCreateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: { type: string; nickname?: string; currency?: string }) => accountApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ title: 'Account created!' }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });
};

export const useUpdateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...d }: { id: string; nickname?: string; isDefault?: boolean }) => accountApi.update(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ title: 'Account updated!' }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });
};

export const useFreezeAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountApi.freeze(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ title: 'Account frozen' }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });
};

export const useUnfreezeAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountApi.unfreeze(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ title: 'Account unfrozen' }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });
};

export const useAccountTransactions = (id: string, params?: Record<string, string>) =>
  useQuery({
    queryKey: ['account-transactions', id, params],
    queryFn: async () => { const { data } = await accountApi.getTransactions(id, params); return data; },
    enabled: !!id,
  });
