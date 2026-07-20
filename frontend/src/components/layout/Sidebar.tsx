'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, LayoutDashboard, CreditCard, ArrowLeftRight, Users, Bell,
  User, Settings, Shield, BarChart3, LogOut, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: CreditCard },
  { href: '/transactions', label: 'Transactions', icon: BarChart3 },
  { href: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { href: '/beneficiaries', label: 'Beneficiaries', icon: Users },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const bottomNavItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link href={href} onClick={onClose}
        className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
          active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent')}>
        <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground')} />
        {label}
        {active && <ChevronRight className="ml-auto h-3 w-3" />}
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <div className="p-1.5 rounded-lg bg-blue-500">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg">NexBank</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">Main</div>
        {navItems.map((item) => <NavLink key={item.href} {...item} />)}

        {isAdmin && (
          <>
            <Separator className="my-3 bg-sidebar-border" />
            <div className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">Admin</div>
            <NavLink href="/admin" label="Admin Dashboard" icon={Shield} />
          </>
        )}

        <Separator className="my-3 bg-sidebar-border" />
        <div className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">Account</div>
        {bottomNavItems.map((item) => <NavLink key={item.href} {...item} />)}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatarUrl || ''} />
            <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
          {isAdmin && <Badge variant="secondary" className="text-[10px] shrink-0">Admin</Badge>}
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => logout.mutate()}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
