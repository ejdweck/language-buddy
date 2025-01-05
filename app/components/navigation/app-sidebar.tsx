import * as React from 'react';
import {
  LayoutDashboard,
  Settings,
  Notebook,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
} from 'lucide-react';
import { NavMain } from './nav-main';
import { NavUser } from '~/components/navigation/nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';
import { useLocation } from '@remix-run/react';
import type { MonthGroup } from '~/types/notebook';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: {
    name: string;
    email: string;
    avatar: string;
  };
  notebookEntries?: MonthGroup[];
}

export function AppSidebar({ userData, notebookEntries, ...props }: AppSidebarProps) {
  const location = useLocation();
  const [isNotebookOpen, setIsNotebookOpen] = React.useState(true);

  const data = {
    user: userData,
    teams: [
      {
        name: 'English',
        logo: GalleryVerticalEnd,
        plan: 'Active',
      },
      {
        name: 'Hebrew',
        logo: AudioWaveform,
        plan: 'Learning',
      },
      {
        name: 'Spanish',
        logo: Command,
        plan: 'New',
      },
    ],
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        isActive: location.pathname === '/dashboard',
      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: Settings,
        isActive: location.pathname.startsWith('/dashboard/settings'),
      },
      {
        title: 'Notebook',
        url: '/dashboard/notebook',
        icon: Notebook,
        isActive: location.pathname.startsWith('/dashboard/notebook'),
        isExpandable: true,
        isExpanded: isNotebookOpen,
        onExpandClick: () => setIsNotebookOpen(!isNotebookOpen),
        items: notebookEntries?.map((monthGroup) => ({
          title: monthGroup.month,
          items: monthGroup.entries.map((entry) => ({
            title: entry.title,
            url: `/dashboard/notebook/${entry.id}`,
            isActive: location.pathname === `/dashboard/notebook/${entry.id}`,
          })),
        })),
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" defaultCollapsed={false} {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
} 