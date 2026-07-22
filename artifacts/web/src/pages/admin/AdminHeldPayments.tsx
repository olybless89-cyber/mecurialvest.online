import { useState } from 'react';
import {
  useGetHeldTransactions,
  useReleaseTransaction,
  useSetCharges,
  useSendPayment,
  getHeldTransactionsQueryKey,
  getListAdminTransactionsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { MoreVertical, Unlock, DollarSign, Send, AlertCircle, Receipt } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminHeldPayments() {
  const queryClient = useQueryClient();

  const { data: heldRes, isLoading } = useGetHeldTransactions();
  const held: any[] = (heldRes as any)?.data ?? [];

  const releaseMutation = useReleaseTransaction();
  const chargesMutation = useSetCharges();
  const sendPaymentMutation = useSendPayment();

  // Send Payment dialog
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendForm, setSendForm] = useState({
    accountId: '', amount: '', description: '',
    hold: true, holdReason: '',
    cotAmount: '', taxAmount: '', chargesNote: '',
  });

  // Charges dialog
  const [chargesOpen, setChargesOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [chargesForm, setChargesForm] = useState({
    cotAmount: '', taxAmount: '', chargesNote: '', cotPaid: false, taxPaid: false,
  });

  const fmt = (v: any) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(v ?? '0') || 0);

  const handleRelease = async (tx: any) => {
    if (!confirm(`Release $${parseFloat(tx.amount).toFixed(2)} to account #${tx.accountId}?`)) return;
    try {
      await releaseMutation.mutateAsync({ id: tx.id });
      toast.success('Funds released successfully');
      queryClient.invalidateQueries({ queryKey: getHeldTransactionsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListAdminTransactionsQueryKey() });
    } catch (e: any) {
      toast.error(e?.message || 'Release failed');
    }
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
      toast.success('Charges updated');
      setChargesOpen(false);
      queryClient.invalidateQueries({ queryKey: getHeldTransactionsQueryKey() });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update charges');
    }
  };

  const handleSendPayment = async () => {
    if (!sendForm.accountId || !sendForm.amount) {
      toast.error('Account ID and amount are required'); return;
    }
    try {
      await sendPaymentMutation.mutateAsync({
        accountId: Number(sendForm.accountId),
        amount: sendForm.amount,
        description: sendForm.description || undefined,
        hold: sendForm.hold,
        holdReason: sendForm.holdReason || undefined,
        cotAmount: sendForm.cotAmount || undefined,
        taxAmount: sendForm.taxAmount || undefined,
        chargesNote: sendForm.chargesNote || undefined,
      });
      toast.success(sendForm.hold ? 'Payment sent and held' : 'Payment sent');
      setIsSendOpen(false);
      setSendForm({ accountId: '', amount: '', description: '', hold: true, holdReason: '', cotAmount: '', taxAmount: '', chargesNote: '' });
      queryClient.invalidateQueries({ queryKey: getHeldTransactionsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListAdminTransactionsQueryKey() });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to send payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Held Payments</h2>
          <p className="text-muted-foreground">Manage held transactions and send admin payments.</p>
        </div>
        <Button onClick={() => setIsSendOpen(true)} className="flex items-center gap-2">
          <Send className="h-4 w-4" /> Send Payment
        </Button>
      </div>

      {/* Held transactions table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" /> On Hold
          </CardTitle>
          <CardDescription>Transactions awaiting release. Set charges before releasing if required.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref / ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>COT</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Charges Paid</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center h-24">Loading…</TableCell></TableRow>
              ) : held.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center h-24 text-muted-foreground">No held transactions.</TableCell></TableRow>
              ) : (
                held.map((tx) => {
                  const cotPaid = !!tx.cotPaid;
                  const taxPaid = !!tx.taxPaid;
                  const hasCot = tx.cotAmount && parseFloat(tx.cotAmount) > 0;
                  const hasTax = tx.taxAmount && parseFloat(tx.taxAmount) > 0;
                  const allPaid = (!hasCot || cotPaid) && (!hasTax || taxPaid);
                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-medium">{tx.refNumber}</span>
                          <span className="text-[10px] text-muted-foreground">#{tx.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        {tx.createdAt ? format(new Date(tx.createdAt), 'MMM d, HH:mm') : '—'}
                      </TableCell>
                      <TableCell className="text-xs">Acct #{tx.accountId}</TableCell>
                      <TableCell className="font-semibold">{fmt(tx.amount)}</TableCell>
                      <TableCell>
                        {hasCot ? (
                          <span className={`text-xs font-medium ${cotPaid ? 'text-green-600' : 'text-amber-600'}`}>
                            {fmt(tx.cotAmount)} {cotPaid ? '✓' : ''}
                          </span>
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell>
                        {hasTax ? (
                          <span className={`text-xs font-medium ${taxPaid ? 'text-green-600' : 'text-amber-600'}`}>
                            {fmt(tx.taxAmount)} {taxPaid ? '✓' : ''}
                          </span>
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={allPaid ? 'default' : 'secondary'} className="text-[10px]">
                          {allPaid ? 'Clear' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openCharges(tx)}>
                              <Receipt className="mr-2 h-4 w-4" /> Set COT / TAX
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRelease(tx)}
                              className="text-green-600"
                            >
                              <Unlock className="mr-2 h-4 w-4" /> Release Funds
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Send Payment Dialog */}
      <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Admin Payment</DialogTitle>
            <DialogDescription>
              Credit a user's account directly. Optionally hold the funds until manually released.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Account ID</Label>
                <Input type="number" placeholder="e.g. 5" value={sendForm.accountId}
                  onChange={e => setSendForm(p => ({ ...p, accountId: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Amount (USD)</Label>
                <Input type="number" step="0.01" placeholder="0.00" value={sendForm.amount}
                  onChange={e => setSendForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input placeholder="e.g. Wire transfer credit" value={sendForm.description}
                onChange={e => setSendForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Place on Hold</p>
                <p className="text-xs text-muted-foreground">Funds are visible but locked until you release them.</p>
              </div>
              <Switch checked={sendForm.hold} onCheckedChange={v => setSendForm(p => ({ ...p, hold: v }))} />
            </div>

            {sendForm.hold && (
              <>
                <div className="space-y-1.5">
                  <Label>Hold Reason (optional)</Label>
                  <Input placeholder="e.g. Pending KYC verification" value={sendForm.holdReason}
                    onChange={e => setSendForm(p => ({ ...p, holdReason: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>COT Amount (optional)</Label>
                    <Input type="number" step="0.01" placeholder="0.00" value={sendForm.cotAmount}
                      onChange={e => setSendForm(p => ({ ...p, cotAmount: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tax Amount (optional)</Label>
                    <Input type="number" step="0.01" placeholder="0.00" value={sendForm.taxAmount}
                      onChange={e => setSendForm(p => ({ ...p, taxAmount: e.target.value }))} />
                  </div>
                </div>
                {(sendForm.cotAmount || sendForm.taxAmount) && (
                  <div className="space-y-1.5">
                    <Label>Charges Note (shown to user)</Label>
                    <Textarea rows={2} placeholder="e.g. Contact support to pay charges and unlock your funds."
                      value={sendForm.chargesNote}
                      onChange={e => setSendForm(p => ({ ...p, chargesNote: e.target.value }))} />
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendOpen(false)}>Cancel</Button>
            <Button onClick={handleSendPayment} disabled={sendPaymentMutation.isPending}>
              {sendPaymentMutation.isPending ? 'Sending…' : sendForm.hold ? 'Send & Hold' : 'Send Payment'}
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
              Define fees required before releasing {selectedTx ? fmt(selectedTx.amount) : ''} (Ref: {selectedTx?.refNumber}).
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
              <Textarea rows={2} placeholder="Payment instructions shown to user…"
                value={chargesForm.chargesNote}
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
