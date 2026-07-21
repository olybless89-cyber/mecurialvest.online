import { useState } from 'react';
import { Link } from 'wouter';
import { useListAccounts, useCreateAccount, getListAccountsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Plus, Lock, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function Accounts() {
  const queryClient = useQueryClient();
  const { data: accounts, isLoading } = useListAccounts();
  const createMutation = useCreateAccount();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountType, setAccountType] = useState('CHECKING');
  const [currency, setCurrency] = useState('USD');

  const accountList = accounts?.data ?? [];

  const formatCurrency = (amount: string | number | undefined, currencyCode = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(
      typeof amount === 'string' ? parseFloat(amount) : amount ?? 0,
    );

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        data: { accountType: accountType as any, currency },
      });
      toast.success('Account created successfully');
      queryClient.invalidateQueries({ queryKey: getListAccountsQueryKey() });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create account');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">Manage your bank accounts and balances.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Open Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open New Account</DialogTitle>
              <DialogDescription>Create a new checking or savings account instantly.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHECKING">Checking Account</SelectItem>
                    <SelectItem value="SAVINGS">Savings Account</SelectItem>
                    <SelectItem value="MONEY_MARKET">Money Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD – US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR – Euro</SelectItem>
                    <SelectItem value="GBP">GBP – British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Open Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-10 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : accountList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accountList.map((account) => (
            <Card
              key={account.id}
              className={`flex flex-col relative overflow-hidden transition-all hover:shadow-md ${
                account.status !== 'ACTIVE' ? 'opacity-80' : ''
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-2 h-full ${
                  account.accountType === 'CHECKING' ? 'bg-blue-500' : 'bg-green-500'
                }`}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      {account.nickname || account.accountType}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground tracking-widest font-mono">
                      •••• {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <Badge
                    variant={account.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className="uppercase text-[10px]"
                  >
                    {account.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-4">
                <div className="text-3xl font-bold tracking-tight">
                  {formatCurrency(account.balance, account.currency)}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 border-t px-6 py-4 flex justify-between">
                <Link href={`/accounts/${account.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                {account.status === 'FROZEN' && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Frozen
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No accounts found</h3>
          <p className="text-muted-foreground mb-6">
            Open your first account to start managing your money.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>Open Account</Button>
        </div>
      )}
    </div>
  );
}
