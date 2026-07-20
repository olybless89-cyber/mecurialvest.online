'use client';

import { useAccounts, useAccountStats } from '@/hooks/useAccounts';
import { useTransactions, useSpendingTrend } from '@/hooks/useTransactions';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AccountCard } from '@/components/dashboard/AccountCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: stats, isLoading: statsLoading } = useAccountStats();
  const { data: txData, isLoading: txLoading } = useTransactions({ limit: '10', page: '1' });
  const { data: trend, isLoading: trendLoading } = useSpendingTrend('6');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {user?.firstName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Here&apos;s what&apos;s happening with your finances today.</p>
      </div>

      {/* Balance + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceCard stats={stats} isLoading={statsLoading} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Spending Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendingChart data={trend} isLoading={trendLoading} />
        </div>
        <div className="space-y-4">
          {accountsLoading
            ? <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}</div>
            : accounts?.slice(0, 2).map((account: any, i: number) => <AccountCard key={account.id} account={account} index={i} />)
          }
        </div>
      </div>

      {/* Recent Transactions */}
      <TransactionList transactions={txData?.data} isLoading={txLoading} limit={8} />
    </div>
  );
}
