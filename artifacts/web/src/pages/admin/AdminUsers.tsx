import { useState, useEffect } from 'react';
import {
  useListAdminUsers,
  useSuspendUser,
  useUnsuspendUser,
  useFundAccount,
  getListAdminUsersQueryKey,
} from '@workspace/api-client-react';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Ban, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

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
  const [fundAccountId, setFundAccountId] = useState('');

  const users: any[] = (usersData as any)?.data ?? [];

  const handleToggleSuspend = async (user: any) => {
    const isSuspended = user.status === 'SUSPENDED';
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

  const handleOpenFund = () => {
    setFundAccountId('');
    setFundAmount('');
    setIsFundOpen(true);
  };

  const handleFund = async () => {
    if (!fundAccountId || !fundAmount) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await fundMutation.mutateAsync({
        data: {
          accountId: Number(fundAccountId),
          amount: fundAmount,
          description: 'Admin account funding',
        },
      });
      toast.success('Account funded successfully');
      setIsFundOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Funding failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">View and manage platform users.</p>
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
            <Button variant="outline" size="sm" onClick={handleOpenFund}>
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
                  <TableCell colSpan={5} className="text-center h-24">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Badge
                          variant={user.status === 'ACTIVE' ? 'default' : 'destructive'}
                          className="text-[10px]"
                        >
                          {user.status}
                        </Badge>
                        {user.isEmailVerified && (
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
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
                            onClick={() => handleToggleSuspend(user)}
                            className={
                              user.status === 'ACTIVE' ? 'text-destructive' : 'text-green-600'
                            }
                          >
                            {user.status === 'ACTIVE' ? (
                              <>
                                <Ban className="mr-2 h-4 w-4" /> Suspend User
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" /> Unsuspend User
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fund Account Dialog */}
      <Dialog open={isFundOpen} onOpenChange={setIsFundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Account</DialogTitle>
            <DialogDescription>
              Add funds directly to an account by its numeric ID.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Target Account ID</Label>
              <Input
                type="number"
                placeholder="e.g. 5"
                value={fundAccountId}
                onChange={(e) => setFundAccountId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the numeric account ID from the database.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFundOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFund} disabled={fundMutation.isPending}>
              {fundMutation.isPending ? 'Processing…' : 'Add Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
