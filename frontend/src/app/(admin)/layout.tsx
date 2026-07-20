'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') router.replace('/dashboard');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;
  return <>{children}</>;
}
