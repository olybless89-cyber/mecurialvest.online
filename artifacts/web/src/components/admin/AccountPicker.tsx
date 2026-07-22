/**
 * AccountPicker — search for a user by name/email, then pick one of their accounts.
 * Shows account ID, type, last-4 account number, and balance.
 */
import { useState, useEffect } from 'react';
import { useListAdminUsers, useGetAdminUserAccounts } from '@workspace/api-client-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PickedAccount {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: string;
  status: string;
  userId: number;
  ownerName: string;
  ownerEmail: string;
}

interface Props {
  value: PickedAccount | null;
  onChange: (acct: PickedAccount | null) => void;
  label?: string;
}

function UserAccounts({
  userId,
  ownerName,
  ownerEmail,
  selected,
  onSelect,
}: {
  userId: number;
  ownerName: string;
  ownerEmail: string;
  selected: PickedAccount | null;
  onSelect: (a: PickedAccount) => void;
}) {
  const { data, isLoading } = useGetAdminUserAccounts(userId);
  const accounts: any[] = (data as any)?.data?.accounts ?? [];

  const fmt = (v: any) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      parseFloat(v ?? '0') || 0,
    );

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (!accounts.length) return <p className="text-xs text-muted-foreground px-1">No accounts.</p>;

  return (
    <div className="space-y-1.5">
      {accounts.map((acct) => {
        const isSelected = selected?.id === acct.id;
        return (
          <button
            key={acct.id}
            type="button"
            onClick={() =>
              onSelect({
                id: acct.id,
                accountNumber: acct.accountNumber,
                accountType: acct.accountType,
                balance: acct.balance,
                status: acct.status,
                userId,
                ownerName,
                ownerEmail,
              })
            }
            className={cn(
              'w-full flex items-center gap-3 text-left border rounded-lg px-3 py-2 text-sm transition-colors',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50',
              acct.status !== 'ACTIVE' && 'opacity-60',
            )}
          >
            {/* ID badge */}
            <span className="shrink-0 font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              ID {acct.id}
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {acct.accountType} — •••{acct.accountNumber.slice(-4)}
              </p>
              <p className="text-xs text-muted-foreground">{fmt(acct.balance)}</p>
            </div>

            <Badge
              variant={acct.status === 'ACTIVE' ? 'default' : 'destructive'}
              className="text-[10px] shrink-0"
            >
              {acct.status}
            </Badge>

            {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

export function AccountPicker({ value, onChange, label = 'Target Account' }: Props) {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: usersRes, isLoading } = useListAdminUsers(
    debounced ? ({ search: debounced, limit: 8 } as any) : ({ limit: 0 } as any),
    { enabled: debounced.length >= 2 } as any,
  );
  const users: any[] = (usersRes as any)?.data?.items ?? [];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Selected account pill */}
      {value && (
        <div className="flex items-center gap-2 border border-primary/40 bg-primary/5 rounded-lg px-3 py-2 text-sm">
          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
            ID {value.id}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium">
              {value.accountType} — •••{value.accountNumber.slice(-4)}
            </p>
            <p className="text-xs text-muted-foreground">
              {value.ownerName} · {value.ownerEmail}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-muted-foreground hover:text-destructive shrink-0"
          >
            Change
          </button>
        </div>
      )}

      {/* Search */}
      {!value && (
        <>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search user by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {search.length >= 2 && (
            <div className="border rounded-lg divide-y max-h-72 overflow-y-auto">
              {isLoading && (
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              )}
              {!isLoading && users.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground">No users found.</p>
              )}
              {users.map((user) => (
                <div key={user.id} className="p-3 space-y-2">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() =>
                      setExpandedUserId(expandedUserId === user.id ? null : user.id)
                    }
                  >
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </button>

                  {expandedUserId === user.id && (
                    <UserAccounts
                      userId={user.id}
                      ownerName={`${user.firstName} ${user.lastName}`}
                      ownerEmail={user.email}
                      selected={value}
                      onSelect={(acct) => {
                        onChange(acct);
                        setSearch('');
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
