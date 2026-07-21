import { useListAuditLogs } from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminAuditLogs() {
  const { data: logsRes, isLoading } = useListAuditLogs({ limit: 100 } as any);
  const logs: any[] = (logsRes as any)?.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
        <p className="text-muted-foreground">Immutable record of admin actions.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Admin ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity / Target</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                      {log.createdAt ? format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">User #{log.adminId}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium uppercase tracking-wider"
                      >
                        {log.action?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.entityType}{' '}
                      <span className="text-muted-foreground">#{log.entityId}</span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.ipAddress || 'Unknown'}
                    </TableCell>
                    <TableCell
                      className="text-xs max-w-[200px] truncate"
                      title={JSON.stringify(log.details)}
                    >
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
