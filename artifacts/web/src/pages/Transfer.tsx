import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useListAccounts,
  useListBeneficiaries,
  useInternalTransfer,
  useExternalTransfer,
  useGetPinStatus,
  getListAccountsQueryKey,
  getListTransactionsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowRightLeft, Building2, Globe, ShieldCheck, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const internalSchema = z.object({
  fromAccountId: z.coerce.number().min(1, 'Please select source account'),
  toAccountId: z.coerce.number().min(1, 'Please select destination account'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().optional(),
}).refine(d => d.fromAccountId !== d.toAccountId, {
  message: 'Cannot transfer to the same account',
  path: ['toAccountId'],
});

const externalSchema = z.object({
  fromAccountId: z.coerce.number().min(1, 'Please select source account'),
  recipientName: z.string().min(2, 'Recipient name is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(5, 'Valid account number required'),
  routingNumber: z.string().min(5, 'Valid routing/swift code required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().optional(),
});

export default function Transfer() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('internal');

  const { data: accountsData } = useListAccounts();
  const { data: beneficiariesData } = useListBeneficiaries();
  const { data: pinStatusRes } = useGetPinStatus();
  const pinSet = (pinStatusRes as any)?.data?.pinSet ?? false;

  const internalMutation = useInternalTransfer();
  const externalMutation = useExternalTransfer();

  const accounts = accountsData?.data ?? [];
  const activeAccounts = accounts.filter((a: any) => a.status === 'ACTIVE');
  const beneficiaries = beneficiariesData?.data ?? [];

  // PIN dialog state
  const [pinDialog, setPinDialog] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pendingData, setPendingData] = useState<{ type: 'internal' | 'external'; data: any } | null>(null);

  const internalForm = useForm({
    resolver: zodResolver(internalSchema),
    defaultValues: { amount: '', description: '' } as any,
  });

  const externalForm = useForm({
    resolver: zodResolver(externalSchema),
    defaultValues: { amount: '', description: '', recipientName: '', bankName: '', accountNumber: '', routingNumber: '' } as any,
  });

  const handleBeneficiarySelect = (beneficiaryId: string) => {
    if (!beneficiaryId || beneficiaryId === 'none') return;
    const b = beneficiaries.find((b: any) => b.id === Number(beneficiaryId));
    if (b) {
      externalForm.setValue('recipientName', (b as any).name);
      externalForm.setValue('bankName', (b as any).bankName);
      externalForm.setValue('accountNumber', (b as any).accountNumber);
      externalForm.setValue('routingNumber', (b as any).routingNumber);
    }
  };

  // Submit handlers — show PIN dialog if PIN is set, otherwise submit directly
  const onInternalSubmit = (data: any) => {
    if (pinSet) {
      setPendingData({ type: 'internal', data });
      setPinValue('');
      setPinDialog(true);
    } else {
      submitInternal(data, undefined);
    }
  };

  const onExternalSubmit = (data: any) => {
    if (pinSet) {
      setPendingData({ type: 'external', data });
      setPinValue('');
      setPinDialog(true);
    } else {
      submitExternal(data, undefined);
    }
  };

  const submitInternal = async (data: any, pin?: string) => {
    try {
      await internalMutation.mutateAsync({ data: { ...data, pin } });
      toast.success('Transfer successful!');
      queryClient.invalidateQueries({ queryKey: getListAccountsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
      internalForm.reset();
      setLocation('/transactions');
    } catch (error: any) {
      toast.error(error?.message || 'Transfer failed');
    }
  };

  const submitExternal = async (data: any, pin?: string) => {
    try {
      await externalMutation.mutateAsync({ data: { ...data, pin } });
      toast.success('Wire transfer initiated!');
      queryClient.invalidateQueries({ queryKey: getListAccountsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
      externalForm.reset();
      setLocation('/transactions');
    } catch (error: any) {
      toast.error(error?.message || 'Transfer failed');
    }
  };

  const handlePinConfirm = async () => {
    if (!pinValue || !/^\d{4,6}$/.test(pinValue)) {
      toast.error('Enter your 4–6 digit PIN');
      return;
    }
    setPinDialog(false);
    if (!pendingData) return;
    if (pendingData.type === 'internal') {
      await submitInternal(pendingData.data, pinValue);
    } else {
      await submitExternal(pendingData.data, pinValue);
    }
    setPendingData(null);
    setPinValue('');
  };

  const isPending = internalMutation.isPending || externalMutation.isPending;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transfer Funds</h2>
        <p className="text-muted-foreground">Move money between your accounts or send to others.</p>
      </div>

      {pinSet && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-lg text-sm border border-green-200 dark:border-green-800">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Transaction PIN is active — you'll be prompted before each transfer.</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="internal" className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" /> Internal Transfer
          </TabsTrigger>
          <TabsTrigger value="external" className="flex items-center gap-2">
            <Globe className="w-4 h-4" /> Wire Transfer
          </TabsTrigger>
        </TabsList>

        {/* INTERNAL */}
        <TabsContent value="internal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Between Accounts</CardTitle>
              <CardDescription>Instant free transfer between your own OrcaBank accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={internalForm.handleSubmit(onInternalSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>From Account</Label>
                    <Select onValueChange={(v) => internalForm.setValue('fromAccountId', Number(v), { shouldValidate: true })}>
                      <SelectTrigger className={internalForm.formState.errors.fromAccountId ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select origin account" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeAccounts.map((a: any) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.nickname || a.accountType} — ${parseFloat(String(a.balance)).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {internalForm.formState.errors.fromAccountId && (
                      <p className="text-xs text-destructive">{internalForm.formState.errors.fromAccountId.message as string}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>To Account</Label>
                    <Select onValueChange={(v) => internalForm.setValue('toAccountId', Number(v), { shouldValidate: true })}>
                      <SelectTrigger className={internalForm.formState.errors.toAccountId ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeAccounts.map((a: any) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.nickname || a.accountType} — *{a.accountNumber.slice(-4)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {internalForm.formState.errors.toAccountId && (
                      <p className="text-xs text-destructive">{internalForm.formState.errors.toAccountId.message as string}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input type="number" step="0.01" placeholder="0.00"
                      className={`pl-7 ${internalForm.formState.errors.amount ? 'border-destructive' : ''}`}
                      {...internalForm.register('amount')} />
                  </div>
                  {internalForm.formState.errors.amount && (
                    <p className="text-xs text-destructive">{internalForm.formState.errors.amount.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Memo (Optional)</Label>
                  <Input placeholder="e.g. Monthly savings" {...internalForm.register('description')} />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Processing...' : pinSet ? 'Continue to PIN' : 'Complete Transfer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXTERNAL */}
        <TabsContent value="external" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Wire Transfer</CardTitle>
              <CardDescription>Send funds securely to an external bank account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={externalForm.handleSubmit(onExternalSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label>From Account</Label>
                  <Select onValueChange={(v) => externalForm.setValue('fromAccountId', Number(v), { shouldValidate: true })}>
                    <SelectTrigger className={externalForm.formState.errors.fromAccountId ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select origin account" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeAccounts.map((a: any) => (
                        <SelectItem key={a.id} value={a.id.toString()}>
                          {a.nickname || a.accountType} — ${parseFloat(String(a.balance)).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {externalForm.formState.errors.fromAccountId && (
                    <p className="text-xs text-destructive">{externalForm.formState.errors.fromAccountId.message as string}</p>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border border-dashed space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Recipient Details
                    </h3>
                    {beneficiaries.length > 0 && (
                      <Select onValueChange={handleBeneficiarySelect}>
                        <SelectTrigger className="w-[200px] h-8 text-xs">
                          <SelectValue placeholder="Autofill from saved..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Clear selection</SelectItem>
                          {beneficiaries.map((b: any) => (
                            <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Recipient Name</Label>
                      <Input {...externalForm.register('recipientName')} className={externalForm.formState.errors.recipientName ? 'border-destructive' : ''} />
                      {externalForm.formState.errors.recipientName && <p className="text-xs text-destructive">{externalForm.formState.errors.recipientName.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input {...externalForm.register('bankName')} className={externalForm.formState.errors.bankName ? 'border-destructive' : ''} />
                      {externalForm.formState.errors.bankName && <p className="text-xs text-destructive">{externalForm.formState.errors.bankName.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input {...externalForm.register('accountNumber')} className={externalForm.formState.errors.accountNumber ? 'border-destructive' : ''} />
                      {externalForm.formState.errors.accountNumber && <p className="text-xs text-destructive">{externalForm.formState.errors.accountNumber.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Routing / SWIFT</Label>
                      <Input {...externalForm.register('routingNumber')} className={externalForm.formState.errors.routingNumber ? 'border-destructive' : ''} />
                      {externalForm.formState.errors.routingNumber && <p className="text-xs text-destructive">{externalForm.formState.errors.routingNumber.message as string}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input type="number" step="0.01" placeholder="0.00"
                      className={`pl-7 ${externalForm.formState.errors.amount ? 'border-destructive' : ''}`}
                      {...externalForm.register('amount')} />
                  </div>
                  {externalForm.formState.errors.amount && <p className="text-xs text-destructive">{externalForm.formState.errors.amount.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Wire Memo (Optional)</Label>
                  <Input placeholder="e.g. Invoice #1234" {...externalForm.register('description')} />
                </div>
                <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300 rounded-lg text-sm">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <p>All external transfers are verified for your security. A flat $15 wire fee applies to international transfers.</p>
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Processing...' : pinSet ? 'Continue to PIN' : 'Send Wire Transfer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* PIN Confirmation Dialog */}
      <Dialog open={pinDialog} onOpenChange={(open) => { if (!open) { setPinDialog(false); setPendingData(null); setPinValue(''); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" /> Enter Transaction PIN
            </DialogTitle>
            <DialogDescription>
              Enter your 4–6 digit PIN to authorise this transfer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              className="text-center text-2xl tracking-widest"
              value={pinValue}
              onChange={e => setPinValue(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => { if (e.key === 'Enter') handlePinConfirm(); }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPinDialog(false); setPendingData(null); setPinValue(''); }}>
              Cancel
            </Button>
            <Button onClick={handlePinConfirm} disabled={isPending}>
              {isPending ? 'Processing…' : 'Confirm Transfer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
