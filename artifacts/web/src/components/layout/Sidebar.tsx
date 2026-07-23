import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Send, 
  Users, 
  Bell, 
  User, 
  Settings,
  ShieldAlert,
  UsersRound,
  History,
  FileText,
  PauseCircle,
  MailIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUser } from '@/lib/auth';
import { NexBankLogo } from './NexBankLogo';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/transfer', label: 'Transfer', icon: Send },
  { href: '/beneficiaries', label: 'Beneficiaries', icon: Users },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const ADMIN_ITEMS = [
  { href: '/admin', label: 'Admin Dashboard', icon: ShieldAlert },
  { href: '/admin/users', label: 'Users', icon: UsersRound },
  { href: '/admin/transactions', label: 'All Transactions', icon: History },
  { href: '/admin/held-payments', label: 'Held Payments', icon: PauseCircle },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  { href: '/admin/email', label: 'Send Email', icon: MailIcon },
];

const SETTINGS_ITEMS = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const user = getUser();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <NexBankLogo />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
            )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {isAdmin && (
          <>
            <div className="mt-8 mb-2 px-6 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Admin
            </div>
            <nav className="grid gap-1 px-3">
              {ADMIN_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
                )}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <nav className="grid gap-1">
          {SETTINGS_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
            )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}