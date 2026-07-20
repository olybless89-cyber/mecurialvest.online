'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Snowflake, Sun, Pencil, Loader2, AlertTriangle } from 'lucide-react';
import { useAccount, useFreezeAccount, useUnfreezeAccount, useUpdateAccount } from '@/hooks/useAccounts';
import { useAccountTransactions } from '@/hooks/useAccounts';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, maskAccountNumber, getAccountTypeLabel, formatDate } from '@/lib/utils';

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: account, isLoading } = useAccount(id);
  const { data: txData, isLoading: txLoading } = useAccountTransactions(id);
  const freeze = useFreezeAccount();
  const unfreeze = useUnfreezeAccount();
  const update = useUpdateAccount();
  const [editOpen, setEditOpen] = useState(false);
  const [nickname, setNickname] = useState('');

  if (isLoading) return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );

  if (!account) return (
    <div className="text-center py-16 text-muted-foreground">Account not found</div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-xl font-bold">{account.nickname || getAccountTypeLabel(account.type)} Account</h1>
          <p className="text-muted-foreground text-sm">{maskAccountNumber(account.accountNumber)}</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Account Details</CardTitle>
              <div className="flex gap-2">
                <Badge variant={account.status === 'ACTIVE' ? 'default' : account.status === 'FROZEN' ? 'secondary' : 'destructive'}>
                  {account.status}
                </Badge>
                {account.isDefault && <Badge variant="outline">Primary</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="font-mono text-sm">{account.accountNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium">{getAccountTypeLabel(account.type)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="font-medium">{account.currency}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Opened</p>
                <p className="font-medium">{formatDate(account.createdAt)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setNickname(account.nickname || ''); setEditOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />Edit Nickname
              </Button>
              {account.status === 'ACTIVE' ? (
                <Button variant="outline" size="sm" className="gap-1.5 text-cyan-600" onClick={() => freeze.mutate(id)} disabled={freeze.isPending}>
                  {freeze.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Snowflake className="h-3.5 w-3.5" />}Freeze
                </Button>
              ) : account.status === 'FROZEN' ? (
                <Button variant="outline" size="sm" className="gap-1.5 text-emerald-600" onClick={() => unfreeze.mutate(id)} disabled={unfreeze.isPending}>
                  {unfreeze.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sun className="h-3.5 w-3.5" />}Unfreeze
                </Button>
              ) : null}
            </div>

            {account.status === 'FROZEN' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                This account is frozen. Transactions are suspended.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <TransactionList transactions={txData?.data?.data} isLoading={txLoading} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Nickname</DialogTitle>
            <DialogDescription>Give your account a memorable name.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <Label>Nickname</Label>
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Emergency Fund" maxLength={50} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => { update.mutate({ id, nickname }); setEditOpen(false); }} disabled={update.isPending}>
              {update.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
