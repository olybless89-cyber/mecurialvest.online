'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatRelativeTime, getTransactionTypeColor } from '@/lib/utils';
import { Transaction } from '@/types';

const TYPE_ICONS: Record<string, React.ElementType> = {
  CREDIT: ArrowDownLeft, DEBIT: ArrowUpRight, TRANSFER: ArrowLeftRight, REVERSAL: RefreshCw,
};
const TYPE_BG: Record<string, string> = {
  CREDIT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  DEBIT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  TRANSFER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  FEE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  INTEREST: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  REVERSAL: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

interface TransactionListProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  limit?: number;
}

export function TransactionList({ transactions, isLoading, limit = 8 }: TransactionListProps) {
  const items = transactions?.slice(0, limit) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        <Link href="/transactions">
          <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-6 pb-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3 w-24" /></div><Skeleton className="h-3.5 w-20" /></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-8 text-center text-muted-foreground text-sm">No transactions yet</div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((tx, i) => {
              const Icon = TYPE_ICONS[tx.type] || ArrowLeftRight;
              const iconBg = TYPE_BG[tx.type] || 'bg-muted text-muted-foreground';
              const isCredit = tx.type === 'CREDIT' || tx.type === 'INTEREST' || tx.type === 'REVERSAL';
              return (
                <motion.li key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full ${iconBg} shrink-0`}><Icon className="h-3.5 w-3.5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(tx.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${isCredit ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <Badge variant={tx.status === 'COMPLETED' ? 'default' : tx.status === 'FAILED' ? 'destructive' : 'secondary'} className="text-[10px] h-4">
                      {tx.status}
                    </Badge>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
