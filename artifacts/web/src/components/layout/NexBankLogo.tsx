import { Link } from 'wouter';

export function NexBankLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold group-hover:scale-105 transition-transform">
        NB
      </div>
      <span className="font-bold text-xl tracking-tight text-sidebar-foreground">NexBank</span>
    </Link>
  );
}