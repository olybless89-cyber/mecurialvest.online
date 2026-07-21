import {
  useListNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  getListNotificationsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Info, ShieldAlert, CheckCircle2, ArrowRightLeft, Trash2, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data: notificationsData, isLoading } = useListNotifications();

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = notificationsData?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: number) => {
    try {
      await markReadMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    } catch {
      // fail silently for UX
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Notification removed');
      queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    } catch {
      toast.error('Failed to remove notification');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SECURITY':
        return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case 'TRANSACTION':
        return <ArrowRightLeft className="h-5 w-5 text-blue-500" />;
      case 'ALERT':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated on your account activity and security alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 flex gap-4 transition-colors hover:bg-muted/30 group cursor-pointer ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        !notification.isRead ? 'bg-background shadow-sm border' : 'bg-muted'
                      }`}
                    >
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4
                        className={`text-sm font-semibold ${
                          !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.createdAt
                          ? format(new Date(notification.createdAt), 'MMM d, h:mm a')
                          : ''}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        !notification.isRead ? 'text-foreground/90' : 'text-muted-foreground'
                      }`}
                    >
                      {(notification as any).message}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary mb-auto" />
                    ) : (
                      <div className="h-2.5" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium">All caught up</h3>
              <p className="text-muted-foreground mt-1">You have no new notifications.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
