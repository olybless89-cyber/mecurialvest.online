'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Trash2, Pencil, Users, Loader2 } from 'lucide-react';
import { beneficiaryApi } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { maskAccountNumber, extractError } from '@/lib/utils';
import { Beneficiary } from '@/types';

const emptyForm = { name: '', accountNumber: '', bankName: '', nickname: '' };

export default function BeneficiariesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Beneficiary | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: beneficiaries, isLoading } = useQuery({
    queryKey: ['beneficiaries'],
    queryFn: async () => { const { data } = await beneficiaryApi.getAll(); return data.data as Beneficiary[]; },
  });

  const add = useMutation({
    mutationFn: () => beneficiaryApi.add({ name: form.name, accountNumber: form.accountNumber, bankName: form.bankName || 'NexBank', nickname: form.nickname || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['beneficiaries'] }); toast({ title: 'Beneficiary added' }); setOpen(false); setForm(emptyForm); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });

  const edit = useMutation({
    mutationFn: () => beneficiaryApi.update(editTarget!.id, { name: form.name, nickname: form.nickname || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['beneficiaries'] }); toast({ title: 'Beneficiary updated' }); setEditTarget(null); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => beneficiaryApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['beneficiaries'] }); toast({ title: 'Beneficiary removed' }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });

  const openAdd = () => { setForm(emptyForm); setEditTarget(null); setOpen(true); };
  const openEdit = (b: Beneficiary) => { setForm({ name: b.name, accountNumber: b.accountNumber, bankName: b.bankName, nickname: b.nickname || '' }); setEditTarget(b); setOpen(true); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Beneficiaries</h1>
          <p className="text-muted-foreground text-sm">Saved recipients for quick transfers</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Beneficiary</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : !beneficiaries?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No beneficiaries yet. Add one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {beneficiaries.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{b.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{b.name}</p>
                      {b.nickname && <span className="text-xs text-muted-foreground">({b.nickname})</span>}
                      {b.isInternal && <Badge variant="secondary" className="text-[10px]">NexBank</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{b.bankName} · {maskAccountNumber(b.accountNumber)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove.mutate(b.id)} disabled={remove.isPending}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editTarget ? 'Edit' : 'Add'} Beneficiary</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" /></div>
            {!editTarget && (
              <>
                <div className="space-y-2"><Label>Account Number</Label><Input value={form.accountNumber} onChange={(e) => setForm(f => ({ ...f, accountNumber: e.target.value }))} placeholder="10-digit account number" /></div>
                <div className="space-y-2"><Label>Bank Name</Label><Input value={form.bankName} onChange={(e) => setForm(f => ({ ...f, bankName: e.target.value }))} placeholder="NexBank" /></div>
              </>
            )}
            <div className="space-y-2"><Label>Nickname <span className="text-muted-foreground">(optional)</span></Label><Input value={form.nickname} onChange={(e) => setForm(f => ({ ...f, nickname: e.target.value }))} placeholder="e.g. Mom" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={editTarget ? () => edit.mutate() : () => add.mutate()} disabled={add.isPending || edit.isPending}>
              {(add.isPending || edit.isPending) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editTarget ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
