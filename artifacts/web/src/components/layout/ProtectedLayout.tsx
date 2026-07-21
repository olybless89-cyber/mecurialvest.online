import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full p-4 sm:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}