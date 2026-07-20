'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Loader2, Users } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { useInitiateTransfer } from '@/hooks/useTransactions';
import { beneficiaryApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, maskAccountNumber } from '@/lib/utils';
import { Beneficiary } from '@/types';

const schema = z.object({
  fromAccountId: z.string().min(1, 'Select an account'),
  toAccountNumber: z.string().min(10, 'Enter a valid account number'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount').refine(v => parseFloat(v) > 0, 'Amount must be positive'),
  note: z.string().max(200).optional(),
});
type FormData = z.infer<typeof schema>;

export default function TransferPage() {
  const { data: accounts } = useAccounts();
  const { data: beneficiaries } = useQuery({
    queryKey: ['beneficiaries'],
    queryFn: async () => { const { data } = await beneficiaryApi.getAll(); return data.data as Beneficiary[]; },
  });
  const transfer = useInitiateTransfer();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const fromId = watch('fromAccountId');
  const fromAccount = accounts?.find((a: any) => a.id === fromId);

  const onSubmit = (data: FormData) => transfer.mutate(data);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transfer Funds</h1>
        <p className="text-muted-foreground text-sm">Send money to any account</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-blue-500/10"><ArrowLeftRight className="h-4 w-4 text-blue-500" /></div>
              New Transfer
            </CardTitle>
            <CardDescription>Funds are transferred instantly for NexBank accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label>From Account</Label>
                <Select onValueChange={(v) => setValue('fromAccountId', v, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.filter((a: any) => a.status === 'ACTIVE').map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.nickname || a.type} · {maskAccountNumber(a.accountNumber)} · {formatCurrency(a.balance, a.currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fromAccountId && <p className="text-red-500 text-xs">{errors.fromAccountId.message}</p>}
                {fromAccount && (
                  <p className="text-xs text-muted-foreground">Available: <span className="font-semibold text-foreground">{formatCurrency(fromAccount.balance, fromAccount.currency)}</span></p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Recipient Account Number</Label>
                </div>
                <Input placeholder="10-digit account number" {...register('toAccountNumber')} />
                {errors.toAccountNumber && <p className="text-red-500 text-xs">{errors.toAccountNumber.message}</p>}
              </div>

              {beneficiaries && beneficiaries.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Quick Fill from Beneficiaries</Label>
                  <div className="flex flex-wrap gap-2">
                    {beneficiaries.map((b) => (
                      <button key={b.id} type="button" onClick={() => setValue('toAccountNumber', b.accountNumber, { shouldValidate: true })}
                        className="px-2.5 py-1 rounded-full text-xs border border-border hover:bg-muted transition-colors">
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input type="number" step="0.01" min="0.01" placeholder="0.00" className="pl-7" {...register('amount')} />
                </div>
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Note <span className="text-muted-foreground">(optional)</span></Label>
                <Input placeholder="What's this transfer for?" {...register('note')} />
              </div>

              <Button type="submit" className="w-full gap-2 h-11" disabled={isSubmitting || transfer.isPending}>
                {(isSubmitting || transfer.isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeftRight className="h-4 w-4" />}
                Send Transfer
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
