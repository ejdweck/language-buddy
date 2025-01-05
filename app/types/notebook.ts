export interface MonthGroup {
  month: string;
  entries: {
    id: string;
    title: string;
  }[];
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