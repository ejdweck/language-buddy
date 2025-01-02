import { Link } from '@remix-run/react';
import { format } from 'date-fns';
import type { MonthGroup } from '../types';

interface NotebookSidebarProps {
  entries: MonthGroup[];
  currentEntryId?: string;
}

export function NotebookSidebar({ entries, currentEntryId }: NotebookSidebarProps) {
  return (
    <div className="space-y-6">
      {entries.map(({ month, entries }) => (
        <div key={month}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {month}
          </h3>
          <ul className="space-y-1">
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link
                  to={`${entry.id}`}
                  className={`block px-2 py-1 rounded-md text-sm ${
                    entry.id === currentEntryId
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="block font-medium">
                    {entry.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 