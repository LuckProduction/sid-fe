import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { BookOutlined, CreditCardOutlined, DashboardOutlined, HomeOutlined, NodeIndexOutlined, TableOutlined, UsergroupAddOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    key: '/',
    element: Landing.Home
  },
  {
    label: 'Berita',
    key: '/news',
    element: Landing.News
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
    children: [
      { path: '/village_profile', label: 'Profil', icon: HomeOutlined, element: Dashboard.VillagePorfile },
      { path: '/employment', label: 'Jabatan', icon: CreditCardOutlined, element: Dashboard.Employment },
      { path: '/hamlet', label: 'Dusun', icon: TableOutlined, element: Dashboard.Hamlet },
      { path: '/village_officials', label: 'Perangkat Desa', icon: UsergroupAddOutlined, element: Dashboard.VillageOfficials }
    ]
  },
  {
    label: 'Atikel Desa',
    children: [
      { path: '/article', label: 'Artikel', icon: BookOutlined, element: Dashboard.Article },
      { path: '/village-potential', label: 'Potensi Desa ', icon: NodeIndexOutlined, element: Dashboard.VillagePotential }
    ]
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
