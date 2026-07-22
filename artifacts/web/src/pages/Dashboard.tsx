import { Link } from 'wouter';
import {
  useGetAccountStats,
  useListAccounts,
  useListTransactions,
} from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  ChevronRight,
  Wallet,
  Clock,
} from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useGetAccountStats();
  const { data: accounts, isLoading: isAccountsLoading } = useListAccounts();
  const { data: recentTxs, isLoading: isRecentTxsLoading } = useListTransactions({ limit: 5 });
  const { data: heldTxs } = useListTransactions({ status: 'HELD', limit: 100 });

  const statsData = (stats as any)?.data;
  const accountList = accounts?.data ?? [];
  const recentList = recentTxs?.data?.items ?? [];
  const heldList = heldTxs?.data?.items ?? [];

  const pendingCreditTotal = heldList.reduce((sum: number, tx: any) => {
    return sum + parseFloat(tx.amount ?? '0');
  }, 0);

  const formatCurrency = (amount: number | string | undefined, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
      typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0),
    );

  const txTypeLabel: Record<string, string> = {
    ADMIN_CREDIT: 'Credit',
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    TRANSFER_IN: 'Transfer In',
    TRANSFER_OUT: 'Transfer Out',
    FEE: 'Fee',
    REVERSAL: 'Reversal',
  };

  return (
    <div className="space-y-5 pb-6">
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 pt-1">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening with your money today.
          </p>
        </div>
        <Link href="/transfer">
          <Button className="shrink-0 gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Send Money
          </Button>
        </Link>
      </div>

      {/* ── Total Balance ─────────────────────── */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isStatsLoading ? (
            <Skeleton className="h-9 w-36" />
          ) : (
            <div className="text-3xl font-bold">{formatCurrency(statsData?.totalBalance)}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Across {statsData?.accountCount ?? 0}{' '}
            {statsData?.accountCount === 1 ? 'account' : 'accounts'}
          </p>
        </CardContent>
      </Card>

      {/* ── Pending Credit ────────────────────── */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Credit</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">
            {formatCurrency(pendingCreditTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {heldList.length === 0
              ? 'No funds on hold'
              : `${heldList.length} transaction${heldList.length === 1 ? '' : 's'} awaiting release`}
          </p>
        </CardContent>
      </Card>

      {/* ── My Accounts ───────────────────────── */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">My Accounts</CardTitle>
          <Link
            href="/accounts"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          {isAccountsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : accountList.length > 0 ? (
            <div className="space-y-1">
              {accountList.slice(0, 4).map((account) => (
                <Link key={account.id} href={`/accounts/${account.id}`}>
                  <div className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                          {account.nickname ||
                            account.accountType.charAt(0) +
                              account.accountType.slice(1).toLowerCase().replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ••••{account.accountNumber.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                      <Badge
                        variant={account.status === 'ACTIVE' ? 'secondary' : 'destructive'}
                        className="text-[10px] py-0 h-4 mt-0.5"
                      >
                        {account.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No accounts found</p>
          )}
        </CardContent>
      </Card>

      {/* ── Recent Transactions ───────────────── */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          <Link
            href="/transactions"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          {isRecentTxsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : recentList.length > 0 ? (
            <div className="space-y-1">
              {recentList.map((tx: any) => {
                const isPositive = ['DEPOSIT', 'TRANSFER_IN', 'ADMIN_CREDIT'].includes(tx.type);
                const isHeld = tx.status === 'HELD';
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                          isHeld
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                            : isPositive
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                              : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                        }`}
                      >
                        {isHeld ? (
                          <Clock className="h-4 w-4" />
                        ) : isPositive ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-none truncate">
                          {tx.description || (txTypeLabel[tx.type] ?? tx.type.replace(/_/g, ' '))}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, h:mm a') : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p
                        className={`text-sm font-semibold ${
                          isHeld
                            ? 'text-amber-600'
                            : isPositive
                              ? 'text-green-600'
                              : ''
                        }`}
                      >
                        {isPositive ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </p>
                      {isHeld && (
                        <Badge variant="outline" className="text-[10px] py-0 h-4 mt-0.5 text-amber-600 border-amber-300">
                          On Hold
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No recent transactions
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
