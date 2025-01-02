import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export interface Project {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
} 