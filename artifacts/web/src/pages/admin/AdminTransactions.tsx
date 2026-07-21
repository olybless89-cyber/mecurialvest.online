import { useListAdminTransactions, useReverseTransaction, getListAdminTransactionsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTransactions() {
  const queryClient = useQueryClient();
  const { data: txData, isLoading } = useListAdminTransactions({ limit: 100 } as any);
  const reverseMutation = useReverseTransaction();

  const transactions = (txData as any)?.data?.items ?? (txData as any)?.data ?? [];

  const handleReverse = async (id: number) => {
    if (!confirm('Are you sure you want to reverse this transaction? This cannot be undone.')) return;
    try {
      await reverseMutation.mutateAsync({ id });
      toast.success('Transaction reversed successfully');
      queryClient.invalidateQueries({ queryKey: getListAdminTransactionsQueryKey() });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to reverse transaction');
    }
  };

  const formatCurrency = (amount: string | number | undefined) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      typeof amount === 'string' ? parseFloat(amount) : amount ?? 0,
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Transactions</h2>
        <p className="text-muted-foreground">System-wide transaction monitoring.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID / Ref</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">#{tx.id}</span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[100px]">
                          {tx.refNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, HH:mm') : '—'}
                    </TableCell>
                    <TableCell className="text-xs">Acct #{tx.accountId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase bg-muted/50">
                        {tx.type?.replace(/_/g, ' ')}
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
                    <TableCell className="text-right font-medium text-sm">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      {tx.status === 'COMPLETED' && !tx.type?.includes('REVERSAL') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleReverse(tx.id)}
                          disabled={reverseMutation.isPending}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" /> Reverse
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
