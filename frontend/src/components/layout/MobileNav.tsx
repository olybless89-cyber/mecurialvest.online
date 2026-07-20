'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
        <Sidebar onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
}
