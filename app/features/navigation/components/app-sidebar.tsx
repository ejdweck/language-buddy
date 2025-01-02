import * as React from 'react';
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Notebook,
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
        name: 'English',
        logo: GalleryVerticalEnd,
        // plan: '',
      },
      {
        name: 'Hebrew',
        logo: AudioWaveform,
        // plan: 'Startup',
      },
      {
        name: 'Spanish',
        logo: Command,
        // plan: 'Free',
      },
    ],
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        isActive: true,
      },
    //   {
    //     title: 'Analytics',
    //     url: '/dashboard/analytics',
    //     icon: BarChart3,
    //   },
    //   {
    //     title: 'Users',
    //     url: '/dashboard/users',
    //     icon: Users,
    //   },
    //   {
    //     title: 'Documents',
    //     url: '/dashboard/documents',
    //     icon: FileText,
    //   },
      {
        title: 'Notebook',
        url: '/dashboard/notebook',
        icon: Notebook,
      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: Settings,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
} 