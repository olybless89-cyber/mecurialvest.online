'use client';

import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime, extractError } from '@/lib/utils';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => { const { data } = await notificationApi.getAll(); return data.data as Notification[]; },
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); qc.invalidateQueries({ queryKey: ['unread-count'] }); },
    onError: (e) => toast({ title: 'Error', description: extractError(e), variant: 'destructive' }),
  });

  const markAll = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); qc.invalidateQueries({ queryKey: ['unread-count'] }); toast({ title: 'All marked as read' }); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); qc.invalidateQueries({ queryKey: ['unread-count'] }); },
  });

  const unreadCount = data?.filter((n) => !n.isRead).length ?? 0;

  const TYPE_COLORS: Record<string, string> = {
    SUCCESS: 'bg-emerald-500', INFO: 'bg-blue-500', WARNING: 'bg-yellow-500', ERROR: 'bg-red-500', TRANSACTION: 'bg-violet-500', SECURITY: 'bg-orange-500',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Notifications {unreadCount > 0 && <Badge className="bg-blue-500 text-white">{unreadCount}</Badge>}
          </h1>
          <p className="text-muted-foreground text-sm">Stay up to date with your account activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
            <CheckCheck className="h-4 w-4" />Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : !data?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={cn(!n.isRead && 'border-blue-500/30 bg-blue-500/5')}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${TYPE_COLORS[n.type] || 'bg-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={cn('text-sm', !n.isRead && 'font-semibold')}>{n.title}</p>
                      {!n.isRead && <Badge className="h-4 bg-blue-500/15 text-blue-600 text-[10px] border-0">New</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!n.isRead && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markRead.mutate(n.id)}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => remove.mutate(n.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
