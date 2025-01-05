export interface NotebookEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface MonthGroup {
  month: string;
  entries: NotebookEntry[];
}

export interface TiptapContent {
  type: string;
  content?: Array<{
    type: string;
    content?: Array<{ type: string; text?: string }>;
  }>;
}

export interface NotebookSidebarItem {
  id: string;
  title: string;
  createdAt: Date;
} 