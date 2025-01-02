import { json, type DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { TiptapEditor } from '~/features/notebook/components/tiptap-editor';
import { NotebookLayout } from '~/features/notebook/components/notebook-layout';
import { requireUserId } from '~/services/auth.server';
import { db } from '~/db';
import { notebookEntries } from '~/db/schema';
import { eq, and } from 'drizzle-orm';
import { useCallback } from 'react';
import { useDebounce } from '~/hooks/use-debounce';
import { getOrCreateNotebook, getNotebookEntriesByMonth } from '~/services/notebook.server';

export async function loader({ request, params }: DataFunctionArgs) {
  const userId = await requireUserId(request);
  const entryId = params.entryId;

  if (!entryId) {
    throw json({ error: 'Entry ID is required' }, { status: 400 });
  }

  const notebook = await getOrCreateNotebook(userId);
  const entries = await getNotebookEntriesByMonth(notebook.id);
  const entry = await db.query.notebookEntries.findFirst({
    where: and(
      eq(notebookEntries.id, entryId),
      eq(notebookEntries.userId, userId)
    ),
  });

  if (!entry) {
    throw json({ error: 'Entry not found' }, { status: 404 });
  }

  return json({ entry, entries, notebook });
}

export async function action({ request, params }: DataFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const content = formData.get('content');
  const title = formData.get('title');
  const entryId = params.entryId;

  if (!content || !entryId) {
    throw json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const [updatedEntry] = await db
      .update(notebookEntries)
      .set({
        content: JSON.parse(content as string),
        title: (title as string) || 'Untitled',
        updatedAt: new Date(),
      })
      .where(and(eq(notebookEntries.id, entryId), eq(notebookEntries.userId, userId)))
      .returning();

    return json({ success: true, entry: updatedEntry });
  } catch (error) {
    console.error('Error updating entry:', error);
    return json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export default function NotebookEntryPage() {
  const { entry, entries, notebook } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleNewEntry = () => {
    const formData = new FormData();
    formData.append('notebookId', notebook.id);
    formData.append('title', 'Untitled');
    formData.append('content', JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }));
    
    fetcher.submit(formData, { method: 'post', action: '/dashboard/notebook' });
  };

  const saveContent = useCallback(
    (content: any) => {
      const formData = new FormData();
      formData.append('content', JSON.stringify(content));
      formData.append('title', entry.title);
      fetcher.submit(formData, { method: 'post' });
    },
    [fetcher, entry.title]
  );

  const debouncedSave = useDebounce(saveContent, 1000);

  return (
    <NotebookLayout 
      entries={entries} 
      currentEntryId={entry.id}
      onNewEntry={handleNewEntry}
      isSubmitting={fetcher.state === 'submitting'}
    >
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{entry.title}</h1>
        <TiptapEditor 
          initialContent={entry.content} 
          onChange={debouncedSave}
        />
      </div>
    </NotebookLayout>
  );
} 