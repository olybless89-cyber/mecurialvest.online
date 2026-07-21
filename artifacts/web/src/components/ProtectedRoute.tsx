import { Redirect } from 'wouter';
import { getToken, getUser } from '@/lib/auth';

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const token = getToken();
  const user = getUser();
  
  if (!token) return <Redirect to="/login" />;
  
  if (adminOnly && user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    return <Redirect to="/dashboard" />;
  }
  
  return <>{children}</>;
}