import type { JSONContent } from '@tiptap/react';

export interface NotebookEntry {
  id: string;
  title: string;
  content: JSONContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotebookSidebarItem {
  id: string;
  title: string;
  createdAt: Date;
  isActive?: boolean;
}

export interface MonthGroup {
  month: string;
  entries: NotebookSidebarItem[];
} 