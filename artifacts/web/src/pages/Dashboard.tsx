import { Link } from 'wouter';
import {
  useGetAccountStats,
  useGetTransactionSummary,
  useGetSpendingTrend,
  useListAccounts,
  useListTransactions,
} from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, ChevronRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useGetAccountStats();
  const { data: summary, isLoading: isSummaryLoading } = useGetTransactionSummary();
  const { data: trend, isLoading: isTrendLoading } = useGetSpendingTrend();
  const { data: accounts, isLoading: isAccountsLoading } = useListAccounts();
  const { data: recentTxs, isLoading: isRecentTxsLoading } = useListTransactions({ limit: 5 });

  const statsData = (stats as any)?.data;
  const summaryData = (summary as any)?.data;
  const trendData = (trend as any)?.data as Array<{ month: string; income: number; expense: number }> | undefined;
  const accountList = accounts?.data ?? [];
  const recentList = recentTxs?.data?.items ?? [];

  const formatCurrency = (amount: number | string | undefined, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
      typeof amount === 'string' ? parseFloat(amount) : amount ?? 0,
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">Here's what's happening with your money today.</p>
        </div>
        <Link href="/transfer">
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Send Money
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(statsData?.totalBalance)}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Across {statsData?.accountCount ?? 0} accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summaryData?.monthlyIncome)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summaryData?.monthlyExpenses)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-full md:col-span-4">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Income vs Expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isTrendLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : trendData && trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#16a34a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#dc2626"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No trend data available yet
              </div>
            )}
          </CardContent>
        </Card>

        <div className="col-span-full md:col-span-3 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>My Accounts</CardTitle>
              <Link
                href="/accounts"
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAccountsLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                ))
              ) : accountList.length > 0 ? (
                accountList.slice(0, 3).map((account) => (
                  <Link key={account.id} href={`/accounts/${account.id}`}>
                    <div className="flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium leading-none group-hover:text-primary transition-colors">
                            {account.nickname || account.accountType}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            *{account.accountNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(account.balance, account.currency)}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No accounts found
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Transactions</CardTitle>
              <Link
                href="/transactions"
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isRecentTxsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  ))
                ) : recentList.length > 0 ? (
                  recentList.map((tx) => {
                    const isPositive = ['DEPOSIT', 'TRANSFER_IN', 'ADMIN_CREDIT'].includes(tx.type);
                    const txTypeLabel: Record<string, string> = {
                      ADMIN_CREDIT: 'Credit', DEPOSIT: 'Deposit', WITHDRAWAL: 'Withdrawal',
                      TRANSFER_IN: 'Transfer In', TRANSFER_OUT: 'Transfer Out', FEE: 'Fee', REVERSAL: 'Reversal',
                    };
                    return (
                      <div key={tx.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              isPositive
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                            }`}
                          >
                            {isPositive ? (
                              <ArrowDownRight className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">
                              {tx.description || (txTypeLabel[tx.type] ?? tx.type.replace(/_/g, ' '))}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, h:mm a') : '—'}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-medium ${isPositive ? 'text-green-600' : ''}`}
                        >
                          {isPositive ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No recent transactions
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
