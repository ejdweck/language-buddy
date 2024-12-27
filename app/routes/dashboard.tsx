import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { sessionStorage } from '~/utils/session.server';
import { AppSidebar } from '~/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (!user) throw redirect('/login');
  return Response.json({ user });
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <SidebarProvider>
      <AppSidebar 
        userData={{
          name: user.name || user.email.split('@')[0],
          email: user.email,
          avatar: user.avatar || '/avatars/default.jpg',
        }} 
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="text-lg font-semibold">Welcome</h3>
              <p className="text-muted-foreground">Hello, {user.email}!</p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="text-lg font-semibold">Stats</h3>
              <p className="text-muted-foreground">Your activity</p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow">
              <h3 className="text-lg font-semibold">Actions</h3>
              <Form action="/logout" method="post">
                <button 
                  type="submit"
                  className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>
          <div className="min-h-[400px] rounded-xl bg-card p-6 shadow">
            <h2 className="text-xl font-bold">Dashboard Content</h2>
            {/* Add your main dashboard content here */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 