import * as React from 'react';
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
} from 'lucide-react';

import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { TeamSwitcher } from '~/features/navigation/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function AppSidebar({ userData, ...props }: AppSidebarProps) {
  const data = {
    user: userData,
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
      },
    ],
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: 'Analytics',
        url: '/dashboard/analytics',
        icon: BarChart3,
      },
      {
        title: 'Users',
        url: '/dashboard/users',
        icon: Users,
      },
      {
        title: 'Documents',
        url: '/dashboard/documents',
        icon: FileText,
      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: Settings,
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '/projects/design',
        icon: LayoutDashboard,
      },
      {
        name: 'Sales & Marketing',
        url: '/projects/sales',
        icon: BarChart3,
      },
      {
        name: 'Travel',
        url: '/projects/travel',
        icon: Users,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
} 