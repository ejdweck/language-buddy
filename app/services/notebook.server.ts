import { db } from '~/db';
import { notebooks, notebookEntries, type NewNotebookEntry } from '~/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { json } from '@remix-run/node';
import { format } from 'date-fns';
import { NotebookSidebarItem, TiptapContent } from '~/features/notebook/types';

export async function getOrCreateNotebook(userId: string) {
  // First try to find existing notebook
  const existingNotebook = await db.query.notebooks.findFirst({
    where: eq(notebooks.userId, userId),
  });

  if (existingNotebook) {
    return existingNotebook;
  }

  // Create default notebook if none exists
  const [newNotebook] = await db
    .insert(notebooks)
    .values({
      userId,
      name: 'My Notebook',
      language: 'en',
      description: 'My personal notebook',
    })
    .returning();

  return newNotebook;
}

export async function saveNotebookEntry({
  userId,
  notebookId,
  title = 'Untitled',
  content,
}: {
  userId: string;
  notebookId: string;
  title?: string;
  content: TiptapContent;
}) {
  try {
    const [entry] = await db
      .insert(notebookEntries)
      .values({
        userId,
        notebookId,
        title: title.slice(0, 50),
        content,
      })
      .returning();

    return { success: true, entry };
  } catch (error) {
    console.error('Error saving notebook entry:', error);
    throw json({ success: false, error: 'Failed to save entry' }, { status: 500 });
  }
}

export async function updateNotebookEntry({
  id,
  userId,
  content,
  title,
}: {
  id: string;
  userId: string;
  content: TiptapContent;
  title: string;
}) {
  try {
    const [entry] = await db
      .update(notebookEntries)
      .set({
        content,
        title,
        updatedAt: new Date(),
      })
      .where(and(eq(notebookEntries.id, id), eq(notebookEntries.userId, userId)))
      .returning();

    return { success: true, entry };
  } catch (error) {
    console.error('Error updating notebook entry:', error);
    throw json(
      { success: false, error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function getLatestEntry({
  userId,
  notebookId,
}: {
  userId: string;
  notebookId: string;
}) {
  return await db.query.notebookEntries.findFirst({
    where: and(
      eq(notebookEntries.userId, userId),
      eq(notebookEntries.notebookId, notebookId)
    ),
    orderBy: (entries) => entries.updatedAt,
  });
}

export async function getNotebookEntriesByMonth(notebookId: string) {
  const entries = await db.query.notebookEntries.findMany({
    where: eq(notebookEntries.notebookId, notebookId),
    orderBy: [desc(notebookEntries.createdAt)],
  });

  const entriesByMonth = entries.reduce<Record<string, NotebookSidebarItem[]>>((acc, entry) => {
    const monthKey = format(new Date(entry.createdAt), 'MMMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push({
      id: entry.id,
      title: entry.title || 'Untitled',
      createdAt: new Date(entry.createdAt),
    });
    return acc;
  }, {});

  return Object.entries(entriesByMonth).map(([month, entries]) => ({
    month,
    entries: entries.map(entry => ({
      ...entry,
      title: entry.title || 'Untitled'
    })),
  }));
}

export async function getNotebookEntry(id: string, userId: string) {
  return await db.query.notebookEntries.findFirst({
    where: and(
      eq(notebookEntries.id, id),
      eq(notebookEntries.userId, userId)
    ),
  });
}

export async function deleteNotebookEntry(id: string, userId: string) {
  try {
    await db
      .delete(notebookEntries)
      .where(and(eq(notebookEntries.id, id), eq(notebookEntries.userId, userId)));

    return { success: true };
  } catch (error) {
    console.error('Error deleting notebook entry:', error);
    throw json({ success: false, error: 'Failed to delete entry' }, { status: 500 });
  }
}

export async function createNotebookEntry(
  notebookId: string, 
  userId: string,
  data: { title: string; content: TiptapContent }
) {
  const [entry] = await db.insert(notebookEntries).values({
    notebookId,
    userId,
    title: data.title,
    content: data.content,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  return entry;
} 