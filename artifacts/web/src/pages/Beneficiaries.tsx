import { useState } from 'react';
import { 
  useListBeneficiaries, 
  useCreateBeneficiary, 
  useUpdateBeneficiary, 
  useDeleteBeneficiary,
  getListBeneficiariesQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Plus, Building, MoreVertical, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';

const beneficiarySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(5, 'Valid account number required'),
  routingNumber: z.string().min(5, 'Valid routing/swift code required'),
  isFavorite: z.boolean().default(false),
});

type BeneficiaryForm = z.infer<typeof beneficiarySchema>;

export default function Beneficiaries() {
  const queryClient = useQueryClient();
  const { data: beneficiariesData, isLoading } = useListBeneficiaries();
  const beneficiaries = beneficiariesData?.data ?? [];
  
  const createMutation = useCreateBeneficiary();
  const updateMutation = useUpdateBeneficiary();
  const deleteMutation = useDeleteBeneficiary();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<BeneficiaryForm>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: { name: '', bankName: '', accountNumber: '', routingNumber: '', isFavorite: false }
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({ name: '', bankName: '', accountNumber: '', routingNumber: '', isFavorite: false });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingId(b.id);
    form.reset({
      name: b.name,
      bankName: b.bankName,
      accountNumber: b.accountNumber,
      routingNumber: b.routingNumber,
      isFavorite: b.isFavorite
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: BeneficiaryForm) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data });
        toast.success('Beneficiary updated');
      } else {
        await createMutation.mutateAsync({ data });
        toast.success('Beneficiary added');
      }
      queryClient.invalidateQueries({ queryKey: getListBeneficiariesQueryKey() });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save beneficiary');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this beneficiary?')) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Beneficiary deleted');
      queryClient.invalidateQueries({ queryKey: getListBeneficiariesQueryKey() });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete');
    }
  };

  const handleToggleFavorite = async (b: any) => {
    try {
      await updateMutation.mutateAsync({
        id: b.id,
        data: { ...b, isFavorite: !b.isFavorite }
      });
      queryClient.invalidateQueries({ queryKey: getListBeneficiariesQueryKey() });
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Beneficiaries</h2>
          <p className="text-muted-foreground">Manage saved contacts for quick wire transfers.</p>
        </div>
        <Button onClick={handleOpenCreate}><Plus className="mr-2 h-4 w-4" /> Add Beneficiary</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : beneficiaries.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {beneficiaries.map((b) => (
            <Card key={b.id} className="relative group overflow-hidden border-muted">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-background/80 backdrop-blur-sm rounded-md shadow-sm border p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenEdit(b)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(b.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {b.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{b.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building className="h-3 w-3" /> {b.bankName}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 -mr-2"
                    onClick={() => handleToggleFavorite(b)}
                  >
                    {b.isFavorite ? <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-5 w-5 text-muted-foreground/30" />}
                  </Button>
                </div>
                
                <div className="bg-muted/40 rounded-md p-3 space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account</span>
                    <span className="font-mono tracking-wider font-medium text-foreground">
                      •••• {b.accountNumber.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Routing</span>
                    <span className="font-mono">{b.routingNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No saved beneficiaries</h3>
          <p className="text-muted-foreground mb-6">Add people or businesses you frequently transfer money to.</p>
          <Button onClick={handleOpenCreate} variant="outline">Add Your First Beneficiary</Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Beneficiary' : 'Add Beneficiary'}</DialogTitle>
            <DialogDescription>
              Enter the recipient's bank details exactly as they appear on their account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipient Name</Label>
              <Input {...form.register('name')} className={form.formState.errors.name ? 'border-destructive' : ''} />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input {...form.register('bankName')} className={form.formState.errors.bankName ? 'border-destructive' : ''} />
              {form.formState.errors.bankName && <p className="text-xs text-destructive">{form.formState.errors.bankName.message}</p>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input {...form.register('accountNumber')} className={form.formState.errors.accountNumber ? 'border-destructive' : ''} />
                {form.formState.errors.accountNumber && <p className="text-xs text-destructive">{form.formState.errors.accountNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Routing / SWIFT</Label>
                <Input {...form.register('routingNumber')} className={form.formState.errors.routingNumber ? 'border-destructive' : ''} />
                {form.formState.errors.routingNumber && <p className="text-xs text-destructive">{form.formState.errors.routingNumber.message}</p>}
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Beneficiary'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}