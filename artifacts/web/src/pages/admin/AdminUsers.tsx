import { useState, useEffect } from 'react';
import {
  useListAdminUsers,
  useSuspendUser,
  useUnsuspendUser,
  useFundAccount,
  useGetAdminUserAccounts,
  useSuspendAccount,
  useUnsuspendAccount,
  getListAdminUsersQueryKey,
  getHeldTransactionsQueryKey,
} from '@workspace/api-client-react';
import { AccountPicker, type PickedAccount } from '@/components/admin/AccountPicker';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Ban, CheckCircle, DollarSign, Wallet } from 'lucide-react';
import { toast } from 'sonner';

// Sub-component: shows accounts for a user with suspend/unsuspend actions
function UserAccountsDialog({ userId, userName, open, onClose }: {
  userId: number; userName: string; open: boolean; onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: userRes, isLoading } = useGetAdminUserAccounts(userId);
  const accounts: any[] = (userRes as any)?.data?.accounts ?? [];

  const suspendAcct = useSuspendAccount();
  const unsuspendAcct = useUnsuspendAccount();

  const toggleAccount = async (acct: any) => {
    const suspend = acct.status === 'ACTIVE';
    try {
      if (suspend) {
        await suspendAcct.mutateAsync({ id: acct.id });
        toast.success(`Account …${acct.accountNumber.slice(-4)} suspended`);
      } else {
        await unsuspendAcct.mutateAsync({ id: acct.id });
        toast.success(`Account …${acct.accountNumber.slice(-4)} unsuspended`);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/' + userId] });
    } catch (e: any) {
      toast.error(e?.message || 'Action failed');
    }
  };

  const fmt = (v: any) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(v ?? '0'));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accounts — {userName}</DialogTitle>
          <DialogDescription>Suspend or unsuspend individual accounts.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading accounts…</p>
        ) : accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No accounts found.</p>
        ) : (
          <div className="space-y-2">
            {accounts.map((acct: any) => (
              <div key={acct.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      ID: {acct.id}
                    </span>
                    <p className="text-sm font-medium">
                      {acct.accountType} — •••{acct.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{fmt(acct.balance)} · {acct.accountNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={acct.status === 'ACTIVE' ? 'default' : 'destructive'}
                    className="text-[10px]"
                  >
                    {acct.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className={acct.status === 'ACTIVE' ? 'text-destructive' : 'text-green-600'}
                    onClick={() => toggleAccount(acct)}
                    disabled={suspendAcct.isPending || unsuspendAcct.isPending}
                  >
                    {acct.status === 'ACTIVE' ? <Ban className="h-3.5 w-3.5 mr-1" /> : <CheckCircle className="h-3.5 w-3.5 mr-1" />}
                    {acct.status === 'ACTIVE' ? 'Suspend' : 'Unsuspend'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const params: Record<string, unknown> = { limit: 50 };
  if (debouncedSearch) params.search = debouncedSearch;

  const { data: usersData, isLoading } = useListAdminUsers(params as any);

  const suspendMutation = useSuspendUser();
  const unsuspendMutation = useUnsuspendUser();
  const fundMutation = useFundAccount();

  const [isFundOpen, setIsFundOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [selectedFundAccount, setSelectedFundAccount] = useState<PickedAccount | null>(null);

  const [accountsUser, setAccountsUser] = useState<{ id: number; name: string } | null>(null);

  const users: any[] = (usersData as any)?.data?.items ?? [];

  const handleToggleSuspend = async (user: any) => {
    const isSuspended = user.isSuspended === true;
    try {
      if (isSuspended) {
        await unsuspendMutation.mutateAsync({ id: user.id });
        toast.success(`${user.email} unsuspended`);
      } else {
        await suspendMutation.mutateAsync({ id: user.id });
        toast.success(`${user.email} suspended`);
      }
      queryClient.invalidateQueries({ queryKey: getListAdminUsersQueryKey() });
    } catch (error: any) {
      toast.error(error?.message || 'Action failed');
    }
  };

  const handleFund = async () => {
    if (!selectedFundAccount || !fundAmount) {
      toast.error('Select an account and enter an amount');
      return;
    }
    try {
      await fundMutation.mutateAsync({
        data: {
          accountId: selectedFundAccount.id,
          amount: fundAmount,
          description: 'Admin account funding',
        },
      });
      toast.success('Account funded successfully');
      setIsFundOpen(false);
      setSelectedFundAccount(null);
      setFundAmount('');
      queryClient.invalidateQueries({ queryKey: getHeldTransactionsQueryKey() });
    } catch (error: any) {
      toast.error(error?.message || 'Funding failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">View and manage platform users and their accounts.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email…"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => { setSelectedFundAccount(null); setFundAmount(''); setIsFundOpen(true); }}>
              <DollarSign className="mr-2 h-4 w-4" /> Fund Account
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Loading…</TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Badge
                          variant={user.isSuspended ? 'destructive' : 'default'}
                          className="text-[10px]"
                        >
                          {user.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                        </Badge>
                        {user.isEmailVerified && (
                          <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setAccountsUser({ id: user.id, name: `${user.firstName} ${user.lastName}` })}
                          >
                            <Wallet className="mr-2 h-4 w-4" /> Manage Accounts
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleSuspend(user)}
                            className={user.isSuspended ? 'text-green-600' : 'text-destructive'}
                          >
                            {user.isSuspended ? (
                              <><CheckCircle className="mr-2 h-4 w-4" /> Unsuspend User</>
                            ) : (
                              <><Ban className="mr-2 h-4 w-4" /> Suspend User</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fund Account Dialog */}
      <Dialog open={isFundOpen} onOpenChange={(open) => { setIsFundOpen(open); if (!open) { setSelectedFundAccount(null); setFundAmount(''); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Fund Account</DialogTitle>
            <DialogDescription>Search for a user, pick their account, then enter the amount.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <AccountPicker value={selectedFundAccount} onChange={setSelectedFundAccount} label="Target Account" />
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input type="number" step="0.01" placeholder="1000.00" value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFundOpen(false)}>Cancel</Button>
            <Button onClick={handleFund} disabled={fundMutation.isPending}>
              {fundMutation.isPending ? 'Processing…' : 'Add Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accounts Dialog */}
      {accountsUser && (
        <UserAccountsDialog
          userId={accountsUser.id}
          userName={accountsUser.name}
          open={!!accountsUser}
          onClose={() => setAccountsUser(null)}
        />
      )}
    </div>
  );
}
