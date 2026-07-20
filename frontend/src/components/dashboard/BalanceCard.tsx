'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, EyeOff, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { AccountStats } from '@/types';

interface BalanceCardProps {
  stats?: AccountStats;
  isLoading?: boolean;
}

export function BalanceCard({ stats, isLoading }: BalanceCardProps) {
  const [hidden, setHidden] = useState(false);

  if (isLoading) return (
    <Card className="col-span-full">
      <CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent>
    </Card>
  );

  const totalBalance = stats?.totalBalance ?? 0;
  const monthlyIncome = stats?.monthlyIncome ?? 0;
  const monthlyExpenses = stats?.monthlyExpenses ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/20"><Wallet className="h-4 w-4" /></div>
              <span className="text-white/80 text-sm font-medium">Total Balance</span>
            </div>
            <button onClick={() => setHidden(!hidden)} className="text-white/70 hover:text-white transition-colors">
              {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mb-6">
            <p className="text-4xl font-bold tracking-tight">
              {hidden ? '••••••' : formatCurrency(totalBalance)}
            </p>
            <p className="text-white/60 text-sm mt-1">Across {stats?.accountCount ?? 0} accounts</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
                <span className="text-white/70 text-xs">Income (30d)</span>
              </div>
              <p className="font-semibold text-sm">{hidden ? '••••' : formatCurrency(monthlyIncome)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown className="h-3.5 w-3.5 text-red-300" />
                <span className="text-white/70 text-xs">Expenses (30d)</span>
              </div>
              <p className="font-semibold text-sm">{hidden ? '••••' : formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
