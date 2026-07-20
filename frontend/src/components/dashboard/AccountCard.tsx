'use client';

import { motion } from 'framer-motion';
import { CreditCard, Snowflake, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, maskAccountNumber, getAccountTypeLabel } from '@/lib/utils';
import { Account } from '@/types';
import { cn } from '@/lib/utils';

const CARD_GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-violet-600 to-purple-600',
  'from-emerald-600 to-teal-600',
  'from-orange-500 to-red-500',
];

interface AccountCardProps {
  account: Account;
  index?: number;
}

export function AccountCard({ account, index = 0 }: AccountCardProps) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/accounts/${account.id}`}>
        <Card className={cn(
          'relative overflow-hidden border-0 text-white cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl',
          `bg-gradient-to-br ${gradient}`
        )}>
          <div className="absolute top-0 right-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-white/10 blur-2xl" />
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">{getAccountTypeLabel(account.type)}</span>
              </div>
              <div className="flex items-center gap-1">
                {account.isDefault && <Badge className="bg-white/20 text-white border-0 text-[10px]">Primary</Badge>}
                {account.status === 'FROZEN' && <Snowflake className="h-4 w-4 text-cyan-300" />}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-2xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
              <p className="text-white/60 text-xs mt-0.5">{account.nickname || account.accountNumber}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white/60 text-xs font-mono">{maskAccountNumber(account.accountNumber)}</p>
              <div className="flex items-center gap-1 text-white/60">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">{account.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
