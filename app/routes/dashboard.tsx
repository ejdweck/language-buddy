import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet, useLoaderData, useMatches } from '@remix-run/react';
import { sessionStorage } from '~/utils/session.server';
import { db } from '~/db';
import { users } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { AppSidebar } from '~/features/navigation/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { Separator } from '~/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

type RouteHandle = {
  breadcrumb?: () => React.ReactNode;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (!user) {
    console.log('No user found, redirecting to login');
    throw redirect('/login');
  }

  // Optionally fetch fresh user data from DB
  const freshUser = await db.query.users.findFirst({
    where: eq(users.id, user.id)
  });
  console.log('freshuser', freshUser)
  return Response.json({ user: freshUser || user });
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const match = matches[matches.length - 1] as { handle: RouteHandle };
  
  return (
    <SidebarProvider>
      <AppSidebar 
        userData={{
          name: user.email.split('@')[0],
          email: user.email,
          avatar: '/avatars/default.jpg',
        }} 
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {match.handle?.breadcrumb?.() || (
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
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 