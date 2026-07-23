import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getToken } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Send, Users, X, Search } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export default function AdminEmail() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);

  const { data: usersRes } = useQuery({
    queryKey: ['admin-users-email'],
    queryFn: () =>
      fetch('/api/admin/users?limit=100', {
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then(r => r.json()),
  });
  const allUsers: User[] = (usersRes as any)?.data?.items ?? [];

  const filtered = allUsers.filter(u =>
    !search ||
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const recipientCount = sendToAll ? allUsers.length : selectedIds.length;

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    if (!sendToAll && selectedIds.length === 0) {
      toast.error('Select at least one recipient');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ to: sendToAll ? 'all' : selectedIds, subject, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to send email');
      const data = json?.data;
      toast.success(`Email sent to ${data?.sent} recipient${data?.sent !== 1 ? 's' : ''}${data?.failed ? ` (${data.failed} failed)` : ''}`);
      setSubject('');
      setMessage('');
      setSelectedIds([]);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Send Email</h2>
        <p className="text-muted-foreground">Compose and send emails to your clients.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compose */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Compose
            </CardTitle>
            <CardDescription>
              Sending to{' '}
              <span className="font-semibold text-foreground">{recipientCount}</span>{' '}
              recipient{recipientCount !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Important update from MercurialVest"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your message here…"
                rows={10}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSend}
              disabled={sending || !subject.trim() || !message.trim() || (!sendToAll && selectedIds.length === 0)}
            >
              <Send className="mr-2 h-4 w-4" />
              {sending ? 'Sending…' : `Send to ${recipientCount} client${recipientCount !== 1 ? 's' : ''}`}
            </Button>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Recipients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Send to all toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <Checkbox
                id="send-all"
                checked={sendToAll}
                onCheckedChange={v => { setSendToAll(!!v); setSelectedIds([]); }}
              />
              <Label htmlFor="send-all" className="cursor-pointer font-medium">
                Send to all active clients ({allUsers.length})
              </Label>
            </div>

            {!sendToAll && (
              <>
                {selectedIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedIds.map(id => {
                      const u = allUsers.find(x => x.id === id);
                      return u ? (
                        <Badge key={id} variant="secondary" className="flex items-center gap-1">
                          {u.firstName} {u.lastName}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => toggleUser(id)} />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search clients…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 rounded-lg border p-2">
                  {filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No clients found</p>
                  )}
                  {filtered.map(u => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => toggleUser(u.id)}
                    >
                      <Checkbox checked={selectedIds.includes(u.id)} readOnly />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
