import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';

import { DashboardOutlined, HomeOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    path: '/',
    element: Landing.Home
  }
];

/**
 * @type {{
 *  label: string;
 *  permissions: [Action, import('@/models/Model').ModelChildren][];
 *  roles: Role[];
 *  children: {
 *   path: string;
 *   label: string;
 *   icon: import('react').ReactNode;
 *   element: import('react').ReactNode;
 *   roles?: Role[];
 *   permissions?: [Action, import('@/models/Model').ModelChildren][];
 *  }[];
 * }[]}
 */
export const dashboardLink = [
  {
    label: 'Overview',
    children: [{ path: '/dashboard', label: 'Dashboard', icon: DashboardOutlined, element: Dashboard.Dashboard }]
  },
  {
    label: 'Pengaturan Desa',
    children: [{ path: '/village_profile', label: 'Profil', icon: HomeOutlined, element: Dashboard.VillagePorfile }]
  }
].map((item) => ({
  ...item,
  permissions: item.children.flatMap((child) => child.permissions).filter((permission) => permission),
  roles: item.children.flatMap((child) => child.roles).filter((role) => role)
}));

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
