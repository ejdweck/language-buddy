import { json, type MetaFunction, type ActionArgs, type LoaderArgs, type DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher, useNavigate } from '@remix-run/react';
import { TiptapEditor } from '~/features/notebook/components/tiptap-editor';
import { NotebookSidebar } from '~/features/notebook/components/notebook-sidebar';
import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { requireUserId } from '~/services/auth.server';
import { 
  getOrCreateNotebook, 
  getLatestEntry, 
  getNotebookEntriesByMonth,
  saveNotebookEntry,
  updateNotebookEntry,
} from '~/services/notebook.server';
import { useCallback } from 'react';
import { useDebounce } from '~/hooks/use-debounce';
import { NotebookLayout } from '~/features/notebook/components/notebook-layout';
import { redirect } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Notebook | Your App Name' },
    { name: 'description', content: 'Take notes with our rich text editor' },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const notebook = await getOrCreateNotebook(userId);
  const entries = await getNotebookEntriesByMonth(notebook.id);
  const latestEntry = await getLatestEntry({
    userId,
    notebookId: notebook.id,
  });

  return json({ notebook, entries, latestEntry });
}

export async function action({ request }: DataFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const content = formData.get('content');
  const title = formData.get('title');
  const notebookId = formData.get('notebookId');

  if (!content || !notebookId) {
    throw json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await saveNotebookEntry({
      userId,
      notebookId: notebookId as string,
      content: JSON.parse(content as string),
      title: (title as string) || 'Untitled',
    });

    // Redirect to the new entry
    return redirect(`/dashboard/notebook/${result.entry.id}`);
  } catch (error) {
    return json({ error: 'Failed to save entry' }, { status: 500 });
  }
}

export function handle() {
  return {
    breadcrumb: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notebook</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  };
}

export default function NotebookPage() {
  const { notebook, entries, latestEntry } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleNewEntry = () => {
    const formData = new FormData();
    formData.append('notebookId', notebook.id);
    formData.append('title', 'Untitled');
    formData.append('content', JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }));
    
    fetcher.submit(formData, { method: 'post' });
  };

  const saveContent = useCallback(
    (content: any) => {
      const formData = new FormData();
      formData.append('content', JSON.stringify(content));
      formData.append('notebookId', notebook.id);
      if (latestEntry?.id) {
        formData.append('entryId', latestEntry.id);
      }
      formData.append('title', 'Untitled'); // We can add title editing later

      fetcher.submit(formData, { method: 'post' });
    },
    [fetcher, notebook.id, latestEntry?.id]
  );

  const debouncedSave = useDebounce(saveContent, 1000);

  return (
    <NotebookLayout 
      entries={entries} 
      currentEntryId={latestEntry?.id}
      onNewEntry={handleNewEntry}
      isSubmitting={fetcher.state === 'submitting'}
    >
      <h1 className="text-3xl font-bold mb-8">
        {latestEntry?.title || 'New Entry'}
      </h1>
      <TiptapEditor
        initialContent={latestEntry?.content}
        onChange={debouncedSave}
      />
    </NotebookLayout>
  );
} 