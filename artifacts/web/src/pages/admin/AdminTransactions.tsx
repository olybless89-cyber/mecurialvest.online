import { useState } from 'react';
import {
  useListAdminTransactions,
  useReverseTransaction,
  useHoldTransaction,
  useReleaseTransaction,
  useSetCharges,
  getListAdminTransactionsQueryKey,
  getHeldTransactionsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RotateCcw, MoreVertical, PauseCircle, Unlock, Receipt } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_VARIANT: Record<string, any> = {
  COMPLETED: 'default',
  PENDING: 'secondary',
  HELD: 'outline',
  FAILED: 'destructive',
  REVERSED: 'destructive',
};

export default function AdminTransactions() {
  const queryClient = useQueryClient();
  const { data: txData, isLoading } = useListAdminTransactions({ limit: 100 } as any);
  const reverseMutation = useReverseTransaction();
  const holdMutation = useHoldTransaction();
  const releaseMutation = useReleaseTransaction();
  const chargesMutation = useSetCharges();

  const transactions: any[] = (txData as any)?.data?.items ?? (txData as any)?.data ?? [];

  const [chargesOpen, setChargesOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [holdReason, setHoldReason] = useState('');
  const [chargesForm, setChargesForm] = useState({
    cotAmount: '', taxAmount: '', chargesNote: '', cotPaid: false, taxPaid: false,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getListAdminTransactionsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getHeldTransactionsQueryKey() });
  };

  const handleReverse = async (id: number) => {
    if (!confirm('Reverse this transaction? This cannot be undone.')) return;
    try {
      await reverseMutation.mutateAsync({ id });
      toast.success('Transaction reversed');
      refresh();
    } catch (e: any) { toast.error(e?.message || 'Failed'); }
  };

  const openHold = (tx: any) => { setSelectedTx(tx); setHoldReason(''); setHoldOpen(true); };
  const handleHold = async () => {
    if (!selectedTx) return;
    try {
      await holdMutation.mutateAsync({ id: selectedTx.id, holdReason });
      toast.success('Transaction placed on hold');
      setHoldOpen(false);
      refresh();
    } catch (e: any) { toast.error(e?.message || 'Failed'); }
  };

  const handleRelease = async (tx: any) => {
    if (!confirm(`Release ${fmt(tx.amount)} to account #${tx.accountId}?`)) return;
    try {
      await releaseMutation.mutateAsync({ id: tx.id });
      toast.success('Funds released');
      refresh();
    } catch (e: any) { toast.error(e?.message || 'Failed'); }
  };

  const openCharges = (tx: any) => {
    setSelectedTx(tx);
    setChargesForm({
      cotAmount: tx.cotAmount ?? '',
      taxAmount: tx.taxAmount ?? '',
      chargesNote: tx.chargesNote ?? '',
      cotPaid: !!tx.cotPaid,
      taxPaid: !!tx.taxPaid,
    });
    setChargesOpen(true);
  };

  const handleSaveCharges = async () => {
    if (!selectedTx) return;
    try {
      await chargesMutation.mutateAsync({
        id: selectedTx.id,
        cotAmount: chargesForm.cotAmount || null,
        taxAmount: chargesForm.taxAmount || null,
        chargesNote: chargesForm.chargesNote,
        cotPaid: chargesForm.cotPaid,
        taxPaid: chargesForm.taxPaid,
      });
      toast.success('Charges saved');
      setChargesOpen(false);
      refresh();
    } catch (e: any) { toast.error(e?.message || 'Failed'); }
  };

  const fmt = (v: any) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(v ?? '0') || 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Transactions</h2>
        <p className="text-muted-foreground">System-wide transaction monitoring and controls.</p>
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
                <TableHead>Charges</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center h-24">Loading…</TableCell></TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">#{tx.id}</span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[100px]">{tx.refNumber}</span>
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
                        variant={STATUS_VARIANT[tx.status] ?? 'secondary'}
                        className={`text-[10px] uppercase ${tx.status === 'HELD' ? 'border-amber-400 text-amber-600 dark:text-amber-400' : ''}`}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {tx.cotAmount || tx.taxAmount ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          {tx.cotAmount ? `COT ${fmt(tx.cotAmount)}` : ''}
                          {tx.cotAmount && tx.taxAmount ? ' · ' : ''}
                          {tx.taxAmount ? `Tax ${fmt(tx.taxAmount)}` : ''}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">{fmt(tx.amount)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(tx.status === 'COMPLETED' || tx.status === 'ADMIN_CREDIT') && !tx.type?.includes('REVERSAL') && (
                            <>
                              <DropdownMenuItem onClick={() => openHold(tx)}>
                                <PauseCircle className="mr-2 h-4 w-4" /> Place on Hold
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleReverse(tx.id)}
                                className="text-destructive"
                              >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reverse
                              </DropdownMenuItem>
                            </>
                          )}
                          {tx.status === 'HELD' && (
                            <>
                              <DropdownMenuItem onClick={() => openCharges(tx)}>
                                <Receipt className="mr-2 h-4 w-4" /> Set COT / TAX
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRelease(tx)} className="text-green-600">
                                <Unlock className="mr-2 h-4 w-4" /> Release Funds
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={8} className="text-center h-24">No transactions found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Hold Dialog */}
      <Dialog open={holdOpen} onOpenChange={setHoldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Transaction on Hold</DialogTitle>
            <DialogDescription>
              Funds will be frozen until you release them. User will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Hold Reason (optional)</Label>
            <Input placeholder="e.g. Pending compliance review" value={holdReason}
              onChange={e => setHoldReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHoldOpen(false)}>Cancel</Button>
            <Button onClick={handleHold} disabled={holdMutation.isPending}>
              {holdMutation.isPending ? 'Holding…' : 'Confirm Hold'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Charges Dialog */}
      <Dialog open={chargesOpen} onOpenChange={setChargesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set COT / TAX Charges</DialogTitle>
            <DialogDescription>
              Set fees required before releasing {selectedTx ? fmt(selectedTx.amount) : ''} (#{selectedTx?.id}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>COT Amount (USD)</Label>
                <Input type="number" step="0.01" placeholder="0.00" value={chargesForm.cotAmount}
                  onChange={e => setChargesForm(p => ({ ...p, cotAmount: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tax Amount (USD)</Label>
                <Input type="number" step="0.01" placeholder="0.00" value={chargesForm.taxAmount}
                  onChange={e => setChargesForm(p => ({ ...p, taxAmount: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Note to User</Label>
              <Textarea rows={2} placeholder="Payment instructions…" value={chargesForm.chargesNote}
                onChange={e => setChargesForm(p => ({ ...p, chargesNote: e.target.value }))} />
            </div>
            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Mark as Paid</p>
            <div className="flex items-center justify-between">
              <span className="text-sm">COT Paid</span>
              <Switch checked={chargesForm.cotPaid} onCheckedChange={v => setChargesForm(p => ({ ...p, cotPaid: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tax Paid</span>
              <Switch checked={chargesForm.taxPaid} onCheckedChange={v => setChargesForm(p => ({ ...p, taxPaid: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChargesOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCharges} disabled={chargesMutation.isPending}>
              {chargesMutation.isPending ? 'Saving…' : 'Save Charges'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
