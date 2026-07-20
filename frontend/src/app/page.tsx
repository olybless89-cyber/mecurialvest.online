'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Building2, Shield, Zap, ArrowRight, Lock, Globe, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Shield, title: 'Bank-Grade Security', desc: 'JWT authentication, HttpOnly cookies, and end-to-end encryption protect your funds.' },
  { icon: Zap, title: 'Instant Transfers', desc: 'Send money to any account in seconds with real-time balance updates.' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Visualize your spending patterns and track financial goals effortlessly.' },
  { icon: Globe, title: 'Always Available', desc: '99.9% uptime with redundant infrastructure across multiple regions.' },
  { icon: Lock, title: 'CSRF Protected', desc: 'Industry-standard CSRF protection and rate limiting on all endpoints.' },
  { icon: Building2, title: 'Multiple Accounts', desc: 'Manage checking, savings, and investment accounts from one dashboard.' },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-blue-400" />
            <span className="text-xl font-bold tracking-tight">NexBank</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" className="text-white/80 hover:text-white">Sign In</Button></Link>
            <Link href="/register"><Button className="bg-blue-500 hover:bg-blue-400 text-white">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8">
            <Zap className="h-4 w-4" /> Next-generation digital banking
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            Banking for the<br />modern world
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Secure, fast, and intelligent banking platform. Manage accounts, make transfers, and track your finances — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-400 h-12 px-8 text-base font-semibold">
                Open Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-blue-500/10"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-white/40">app.nexbank.com/dashboard</span>
          </div>
          <div className="grid grid-cols-3 gap-4 p-6">
            {[
              { label: 'Total Balance', value: '$136,720.50', change: '+2.4%' },
              { label: 'Monthly Income', value: '$8,500.00', change: '+12%' },
              { label: 'Monthly Expenses', value: '$3,240.00', change: '-5%' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-left">
                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-400 mt-1">{stat.change} this month</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Built with enterprise-grade security and a developer-first mindset.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <f.icon className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto p-12 rounded-3xl border border-blue-500/20 bg-blue-500/5">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Join thousands of users managing their finances smarter.</p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-400 h-12 px-10 text-base font-semibold">
              Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 className="h-4 w-4 text-blue-400" />
          <span className="text-white font-semibold">NexBank</span>
        </div>
        <p>© {new Date().getFullYear()} NexBank. All rights reserved. FDIC Insured.</p>
      </footer>
    </div>
  );
}
