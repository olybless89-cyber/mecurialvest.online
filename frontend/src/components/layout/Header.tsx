'use client';

import { Bell, Menu, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => { const { data } = await notificationApi.getUnreadCount(); return data.data?.count as number; },
    refetchInterval: 30000,
  });

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-40">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground w-64">
          <Search className="h-4 w-4" />
          <span>Search transactions...</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-4 w-4" />
            {data && data > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-blue-500 text-white border-0">
                {data > 9 ? '9+' : data}
              </Badge>
            )}
          </Button>
        </Link>

        <Link href="/profile">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user?.avatarUrl || ''} />
            <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
