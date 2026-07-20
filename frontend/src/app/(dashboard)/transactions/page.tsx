'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Filter, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { useTransactions, useExportTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDateTime, getStatusBadgeVariant } from '@/lib/utils';
import { Transaction } from '@/types';

const TYPE_ICONS: Record<string, React.ElementType> = {
  CREDIT: ArrowDownLeft, DEBIT: ArrowUpRight, TRANSFER: ArrowLeftRight, REVERSAL: RefreshCw,
};
const TYPE_COLORS: Record<string, string> = {
  CREDIT: 'text-emerald-500', DEBIT: 'text-red-500', TRANSFER: 'text-blue-500', REVERSAL: 'text-yellow-500',
};

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const exportTx = useExportTransactions();

  const params: Record<string, string> = { page: String(page), limit: '20' };
  if (type !== 'ALL') params.type = type;
  if (status !== 'ALL') params.status = status;
  if (search) params.search = search;

  const { data, isLoading } = useTransactions(params);
  const transactions: Transaction[] = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground text-sm">Your complete transaction history</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => exportTx.mutate(params)} disabled={exportTx.isPending}>
          <Download className="h-4 w-4" />Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
                <SelectItem value="FEE">Fee</SelectItem>
                <SelectItem value="INTEREST">Interest</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REVERSED">Reversed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx, i) => {
                const Icon = TYPE_ICONS[tx.type] || ArrowLeftRight;
                const isCredit = ['CREDIT', 'INTEREST', 'REVERSAL'].includes(tx.type);
                return (
                  <motion.div key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className={`p-2 rounded-full bg-muted shrink-0 ${TYPE_COLORS[tx.type] || ''}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(tx.createdAt)} · {tx.type}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className={`text-sm font-semibold ${isCredit ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                      </p>
                      <Badge variant={getStatusBadgeVariant(tx.status)} className="text-[10px] h-4">{tx.status}</Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Page {page} of {pagination.totalPages} · {pagination.total} results</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
