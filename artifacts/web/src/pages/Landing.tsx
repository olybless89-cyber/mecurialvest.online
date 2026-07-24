import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NexBankLogo } from '@/components/layout/NexBankLogo';
import { useState, useEffect } from 'react';

const slides = [
  { src: '/slide1.jpg', alt: 'Modern bank interior' },
  { src: '/slide2.jpg', alt: 'City financial district at night' },
  { src: '/slide3.jpg', alt: 'Mobile banking app' },
  { src: '/slide4.jpg', alt: 'Digital finance' },
];

export default function Landing() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <header className="container mx-auto px-6 h-20 flex items-center justify-between border-b">
        <NexBankLogo />
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/register">
            <Button>Open an Account</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Slideshow */}
        <section className="relative overflow-hidden pt-24 pb-32 min-h-[560px] flex items-center">
          {/* Slideshow background */}
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Slide dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-white w-6' : 'bg-white/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              Banking <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Reimagined</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the future of finance. Manage multiple accounts, send global transfers instantly, and stay secure with enterprise-grade protection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Sign in to your account
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-white/70">
              <div className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-blue-400" /> No hidden fees</div>
              <div className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-blue-400" /> Setup in 2 minutes</div>
              <div className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-blue-400" /> 24/7 Support</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50 border-t">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to manage your money</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Built for the modern economy with powerful tools for individuals and businesses.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Transfers</h3>
                <p className="text-muted-foreground leading-relaxed">Send and receive money instantly across the globe. Internal transfers clear in milliseconds.</p>
              </div>
              <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bank-grade Security</h3>
                <p className="text-muted-foreground leading-relaxed">Your funds are protected with end-to-end encryption, multi-factor authentication, and constant monitoring.</p>
              </div>
              <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-account Mastery</h3>
                <p className="text-muted-foreground leading-relaxed">Keep your savings, checking, and business funds separated but accessible from one beautiful dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">OB</div>
            <span className="font-semibold">OrcaBank</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} OrcaBank Inc. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
