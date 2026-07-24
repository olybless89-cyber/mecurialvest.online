import { Link } from 'wouter';

export { OrcaBankLogo as NexBankLogo };
export function OrcaBankLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold group-hover:scale-105 transition-transform">
        OB
      </div>
      <span className="font-bold text-xl tracking-tight text-foreground">OrcaBank</span>
    </Link>
  );
}