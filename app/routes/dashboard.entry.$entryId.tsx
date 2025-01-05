import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData, useNavigation, useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { TiptapEditor } from '~/components/notebook/tiptap-editor';
import { Input } from '~/components/ui/input';
import { getNotebookEntry, updateNotebookEntry, deleteNotebookEntry } from '~/services/notebook.server';
import { requireUserId } from '~/services/auth.server';
import { useDebounce } from '~/hooks/use-debounce';
import { format } from 'date-fns';
import { Button } from '~/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const entry = await getNotebookEntry(params.entryId!, userId);
  
  if (!entry) {
    throw new Response('Not Found', { status: 404 });
  }
  
  return Response.json({ entry });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'delete') {
    await deleteNotebookEntry(params.entryId!, userId);
    return redirect('/dashboard/notebook');
  }

  console.log('Form data entries:', Object.fromEntries(formData));
  
  const contentRaw = formData.get('content');
  console.log('Content raw:', contentRaw);
  
  if (!contentRaw) {
    return Response.json({ success: false, error: 'No content provided' }, { status: 400 });
  }

  try {
    const content = JSON.parse(contentRaw.toString());
    const title = formData.get('title') as string;

    if (!title) {
      return Response.json({ success: false, error: 'No title provided' }, { status: 400 });
    }

    const result = await updateNotebookEntry({
      id: params.entryId!,
      userId,
      content,
      title,
    });

    return Response.json(result);
  } catch (error) {
    console.error('Parse error:', error);
    return Response.json({ success: false, error: 'Invalid content format' }, { status: 400 });
  }
}

export default function NotebookEntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [title, setTitle] = useState(entry.title || 'Untitled');
  const [content, setContent] = useState(entry.content);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Handle save
  const handleSave = () => {
    const titleToSave = String(title || '').trim();
    if (!titleToSave) return;
    
    if (!content || content.content?.length === 0) return;

    setSaveStatus('saving');
    const formData = new FormData();
    formData.set('title', titleToSave || 'Untitled');
    formData.set('content', JSON.stringify(content));
    
    fetcher.submit(
      formData,
      { 
        method: 'POST',
        action: `/dashboard/entry/${entry.id}`
      }
    );
  };

  // Update save status based on fetcher state
  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setSaveStatus('saving');
    } else if (fetcher.state === 'idle') {
      if (fetcher.data?.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else if (fetcher.data?.error) {
        setSaveStatus('error');
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleDelete = () => {
    const formData = new FormData();
    formData.set('intent', 'delete');
    fetcher.submit(formData, { method: 'POST' });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold"
          />
          <Button
            onClick={handleSave}
            disabled={fetcher.state === 'submitting'}
          >
            Save
          </Button>
          <div className="text-sm">
            {saveStatus === 'saving' && <span className="text-yellow-600">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-green-600">Saved</span>}
            {saveStatus === 'error' && <span className="text-red-600">Error saving</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {format(new Date(entry.updatedAt), 'MMM d, yyyy h:mm a')}
          </span>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your notebook entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <TiptapEditor
        initialContent={content}
        onChange={setContent}
      />
    </div>
  );
} 