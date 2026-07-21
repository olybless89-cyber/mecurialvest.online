import { useState } from 'react';
import { useParams, Link } from 'wouter';
import {
  useGetAccount,
  useGetAccountTransactions,
  useUpdateAccount,
  useFreezeAccount,
  useUnfreezeAccount,
  getGetAccountQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Edit2, Lock, Unlock, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountDetail() {
  const { id } = useParams();
  const accountId = Number(id);
  const queryClient = useQueryClient();

  const { data: accountRes, isLoading: isAccountLoading } = useGetAccount(accountId);
  const { data: txRes, isLoading: isTransactionsLoading } = useGetAccountTransactions(accountId);

  const account = accountRes?.data;
  const transactions = txRes?.data?.items ?? [];

  const updateMutation = useUpdateAccount();
  const freezeMutation = useFreezeAccount();
  const unfreezeMutation = useUnfreezeAccount();

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [nickname, setNickname] = useState('');

  const formatCurrency = (amount: string | number | undefined, currencyCode = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(
      typeof amount === 'string' ? parseFloat(amount) : amount ?? 0,
    );

  const handleEditNickname = async () => {
    try {
      await updateMutation.mutateAsync({ id: accountId, data: { nickname } });
      toast.success('Account nickname updated');
      queryClient.invalidateQueries({ queryKey: getGetAccountQueryKey(accountId) });
      setIsEditNameOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update nickname');
    }
  };

  const handleToggleFreeze = async () => {
    const isFrozen = account?.status === 'FROZEN';
    try {
      if (isFrozen) {
        await unfreezeMutation.mutateAsync({ id: accountId });
        toast.success('Account unfrozen successfully');
      } else {
        await freezeMutation.mutateAsync({ id: accountId });
        toast.success('Account frozen successfully');
      }
      queryClient.invalidateQueries({ queryKey: getGetAccountQueryKey(accountId) });
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isFrozen ? 'unfreeze' : 'freeze'} account`);
    }
  };

  if (!accountId || isNaN(accountId)) {
    return <div className="p-6">Invalid account ID</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/accounts">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-sm font-medium text-muted-foreground">Back to Accounts</span>
      </div>

      {isAccountLoading ? (
        <Card>
          <CardContent className="p-8">
            <Skeleton className="h-8 w-[200px] mb-4" />
            <Skeleton className="h-12 w-[300px]" />
          </CardContent>
        </Card>
      ) : account ? (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Account Card */}
          <Card className="md:col-span-2 bg-primary text-primary-foreground border-none relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />
            <CardContent className="p-8 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-medium text-primary-foreground/80 flex items-center gap-2">
                    {account.nickname || account.accountType}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20 hover:text-white"
                      onClick={() => {
                        setNickname(account.nickname || '');
                        setIsEditNameOpen(true);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </h3>
                  <p className="text-sm font-mono tracking-widest text-primary-foreground/70 mt-1">
                    {account.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10"
                >
                  {account.currency}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-foreground/80 mb-1">Available Balance</p>
                <div className="text-4xl md:text-5xl font-bold tracking-tight">
                  {formatCurrency(account.balance, account.currency)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5" /> Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={
                    account.status === 'ACTIVE'
                      ? 'default'
                      : account.status === 'FROZEN'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {account.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Opened On</span>
                <span className="text-sm font-medium">
                  {account.createdAt ? format(new Date(account.createdAt), 'MMM d, yyyy') : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Routing #</span>
                <span className="text-sm font-mono">{account.routingNumber || '—'}</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button
                variant={account.status === 'FROZEN' ? 'default' : 'destructive'}
                className="w-full"
                onClick={handleToggleFreeze}
                disabled={freezeMutation.isPending || unfreezeMutation.isPending}
              >
                {account.status === 'FROZEN' ? (
                  <>
                    <Unlock className="mr-2 h-4 w-4" /> Unfreeze Account
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Freeze Account
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">Account not found</div>
      )}

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isTransactionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const isPositive = ['DEPOSIT', 'TRANSFER_IN', 'REVERSAL'].includes(tx.type);
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a') : '—'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.description || tx.type.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {tx.type.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === 'COMPLETED'
                              ? 'default'
                              : tx.status === 'PENDING'
                                ? 'secondary'
                                : 'destructive'
                          }
                          className="text-[10px] uppercase"
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${isPositive ? 'text-green-600' : ''}`}
                      >
                        {isPositive ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found for this account.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Nickname Dialog */}
      <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Nickname</DialogTitle>
            <DialogDescription>
              Give this account a custom name to identify it easily.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Vacation Fund"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditNickname} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
