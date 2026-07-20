'use client';

import { ArrowLeftRight, Plus, Download, Users, Bell, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const actions = [
  { label: 'Transfer', icon: ArrowLeftRight, href: '/transfer', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20' },
  { label: 'New Account', icon: Plus, href: '/accounts', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' },
  { label: 'Export', icon: Download, href: '/transactions', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20' },
  { label: 'Beneficiaries', icon: Users, href: '/beneficiaries', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20' },
  { label: 'Notifications', icon: Bell, href: '/notifications', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20' },
  { label: 'Accounts', icon: CreditCard, href: '/accounts', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20' },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Link href={action.href}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-pointer ${action.color}`}>
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
