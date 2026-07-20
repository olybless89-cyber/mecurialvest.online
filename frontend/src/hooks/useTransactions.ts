import { useQuery, useMutation } from '@tanstack/react-query';
import { transactionApi, transferApi } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { extractError, downloadBlob } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

export const useTransactions = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => { const { data } = await transactionApi.getAll(params); return data; },
  });

export const useTransaction = (id: string) =>
  useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => { const { data } = await transactionApi.getById(id); return data.data; },
    enabled: !!id,
  });

export const useTransactionSummary = (period?: string) =>
  useQuery({
    queryKey: ['transaction-summary', period],
    queryFn: async () => { const { data } = await transactionApi.getSummary(period); return data.data; },
  });

export const useSpendingTrend = (months?: string) =>
  useQuery({
    queryKey: ['spending-trend', months],
    queryFn: async () => { const { data } = await transactionApi.getSpendingTrend(months); return data.data; },
  });

export const useExportTransactions = () =>
  useMutation({
    mutationFn: async (params?: Record<string, string>) => {
      const response = await transactionApi.export(params);
      downloadBlob(response.data as Blob, `transactions-${Date.now()}.csv`);
    },
    onError: (e) => toast({ title: 'Export failed', description: extractError(e), variant: 'destructive' }),
  });

export const useInitiateTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: { fromAccountId: string; toAccountNumber: string; amount: string; note?: string }) =>
      transferApi.initiate(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['account-stats'] });
      toast({ title: 'Transfer successful!', description: 'Funds have been transferred.' });
    },
    onError: (e) => toast({ title: 'Transfer failed', description: extractError(e), variant: 'destructive' }),
  });
};
