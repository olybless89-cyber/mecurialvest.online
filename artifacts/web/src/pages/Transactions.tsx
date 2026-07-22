import { useState, useEffect } from 'react';
import { useListTransactions } from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const params: Record<string, unknown> = { limit: 50 };
  if (debouncedSearch) params.search = debouncedSearch;
  if (typeFilter !== 'ALL') params.type = typeFilter;
  if (statusFilter !== 'ALL') params.status = statusFilter;

  const { data: response, isLoading } = useListTransactions(params as any);
  const transactions = response?.data?.items ?? [];

  const formatCurrency = (amount: string | number | undefined, currencyCode = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(
      typeof amount === 'string' ? parseFloat(amount) : amount ?? 0,
    );

  // User-friendly label for transaction types
  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      ADMIN_CREDIT: 'Credit',
      DEPOSIT: 'Deposit',
      WITHDRAWAL: 'Withdrawal',
      TRANSFER_IN: 'Transfer In',
      TRANSFER_OUT: 'Transfer Out',
      FEE: 'Fee',
      REVERSAL: 'Reversal',
    };
    return map[type] ?? type.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">View and filter your complete transaction history.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search description or ref…"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="DEPOSIT">Deposits</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
                  <SelectItem value="TRANSFER_IN">Transfers In</SelectItem>
                  <SelectItem value="TRANSFER_OUT">Transfers Out</SelectItem>
                  <SelectItem value="FEE">Fees</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REVERSED">Reversed</SelectItem>
                  <SelectItem value="HELD">Held</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const isPositive = ['DEPOSIT', 'TRANSFER_IN', 'REVERSAL', 'ADMIN_CREDIT'].includes(tx.type);
                    const isHeld = tx.status === 'HELD';
                    return (
                      <TableRow key={tx.id} className={isHeld ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {tx.refNumber}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, yyyy') : '—'}
                        </TableCell>
                        <TableCell className="max-w-[220px]">
                          <p className="font-medium truncate" title={tx.description ?? tx.type}>
                            {tx.description || typeLabel(tx.type)}
                          </p>
                          {isHeld && (tx.holdReason || tx.cotAmount || tx.taxAmount) && (
                            <div className="mt-1 space-y-0.5">
                              {tx.holdReason && (
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                  ⏸ {tx.holdReason}
                                </p>
                              )}
                              {(tx.cotAmount || tx.taxAmount) && (
                                <p className="text-xs text-muted-foreground">
                                  {tx.chargesNote
                                    ? tx.chargesNote
                                    : [
                                        tx.cotAmount ? `COT: $${parseFloat(tx.cotAmount).toFixed(2)}` : null,
                                        tx.taxAmount ? `Tax: $${parseFloat(tx.taxAmount).toFixed(2)}` : null,
                                      ]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </p>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-medium bg-muted/50"
                          >
                            {typeLabel(tx.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tx.status === 'COMPLETED'
                                ? 'default'
                                : tx.status === 'HELD'
                                  ? 'secondary'
                                  : tx.status === 'PENDING'
                                    ? 'secondary'
                                    : 'destructive'
                            }
                            className={`text-[10px] uppercase ${
                              tx.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800 hover:bg-green-100 border-transparent dark:bg-green-900/30 dark:text-green-400'
                                : tx.status === 'HELD'
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-transparent dark:bg-amber-900/30 dark:text-amber-400'
                                  : ''
                            }`}
                          >
                            {tx.status === 'HELD' ? '⏸ On Hold' : tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium whitespace-nowrap ${
                            isPositive ? 'text-green-600 dark:text-green-500' : ''
                          }`}
                        >
                          {isPositive ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-1">
                Try adjusting your filters or search term.
              </p>
              {(searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
