import { Link, useLoaderData, Form } from '@remix-run/react';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { requireUserId } from '~/services/auth.server';
import { getOrCreateNotebook, getNotebookEntriesByMonth, createNotebookEntry } from '~/services/notebook.server';
import { Button } from '~/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { MonthGroup } from '~/types/notebook';

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const notebook = await getOrCreateNotebook(userId);
  
  const entry = await createNotebookEntry(
    notebook.id,
    userId,
    {
      title: 'Untitled Entry',
      content: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }]
      }
    }
  );
  
  return redirect(`/dashboard/entry/${entry.id}`);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const notebook = await getOrCreateNotebook(userId);
  const notebookEntries = await getNotebookEntriesByMonth(notebook.id);
  
  return Response.json({ notebookEntries });
}

export default function NotebookPage() {
  const { notebookEntries } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Notebook</h2>
        <Form method="post">
          <Button type="submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Form>
      </div>
      
      <div className="space-y-8">
        {notebookEntries.map((monthGroup: MonthGroup) => (
          <div key={monthGroup.month} className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">
              {monthGroup.month}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {monthGroup.entries.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/dashboard/entry/${entry.id}`}
                  className="block space-y-2 rounded-lg border p-4 hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{entry.title}</h4>
                    <time className="text-sm text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  {entry.content && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {entry.content}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
        
        {notebookEntries.length === 0 && (
          <div className="text-center">
            <p className="text-muted-foreground">No entries yet.</p>
            <Form method="post">
              <Button type="submit" className="mt-4">
                Create your first entry
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
} 