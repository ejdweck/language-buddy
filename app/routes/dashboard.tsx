import { Outlet, useLoaderData, useMatches } from '@remix-run/react';
import { sessionStorage } from '~/utils/session.server';
import { AppSidebar } from '~/components/navigation/app-sidebar';
import { getOrCreateNotebook, getNotebookEntriesByMonth } from '~/services/notebook.server';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '~/components/ui/sidebar';
import { Separator } from '~/components/ui/separator';
import { redirect } from '@remix-run/node';

// Add type for the handle property
interface RouteHandle {
  breadcrumb?: () => React.ReactNode;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');

  // Redirect to login if no user is found
  if (!user) {
    return redirect('/login');
  }

  const notebook = await getOrCreateNotebook(user.id);
  const notebookEntries = await getNotebookEntriesByMonth(notebook.id);

  return Response.json({
    user: {
      name: user.email,
      email: user.email,
      avatar: 'https://github.com/shadcn.png',
    },
    notebookEntries,
  });
}

export default function DashboardLayout() {
  const { user, notebookEntries } = useLoaderData<typeof loader>();
  const matches = useMatches();
  
  // Add type assertion for match.handle
  const breadcrumb = matches
    .find((match) => (match.handle as RouteHandle)?.breadcrumb)
    ?.handle as RouteHandle | undefined;

  return (
    <SidebarProvider>
      <AppSidebar userData={user} notebookEntries={notebookEntries} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumb?.breadcrumb?.()}
          </div>
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 