import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { NotebookSidebar } from './notebook-sidebar';
import type { MonthGroup } from '../types';

interface NotebookLayoutProps {
  children: React.ReactNode;
}

export function NotebookLayout({ children }: NotebookLayoutProps) {
  return (
    <div className="rounded-xl bg-card p-6 shadow">
      {children}
    </div>
  );
} 