import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { BankOutlined, BookOutlined, CreditCardOutlined, DashboardOutlined, HomeOutlined, NodeIndexOutlined, PaperClipOutlined, PartitionOutlined, RocketOutlined, TableOutlined, UsergroupAddOutlined } from '@ant-design/icons';

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
      { path: '/village_profile', label: 'Profil', icon: HomeOutlined, element: Dashboard.VillageProfile },
      { path: '/employment', label: 'Jabatan', icon: CreditCardOutlined, element: Dashboard.Employment },
      { path: '/hamlet', label: 'Dusun', icon: TableOutlined, element: Dashboard.Hamlet },
      { path: '/village_officials', label: 'Perangkat Desa', icon: UsergroupAddOutlined, element: Dashboard.VillageOfficials },
      { path: '/village_institutions', label: 'Lembaga Desa', icon: BankOutlined, element: Dashboard.VillageInstitution },
      { path: '/visi-misi', label: 'Visi Misi', icon: RocketOutlined, element: Dashboard.VisiMisi },
      { path: '/residential', label: 'Kependudukan', icon: PartitionOutlined, element: Dashboard.Resident }
    ]
  },
  {
    label: 'Atikel Desa',
    children: [
      { path: '/article', label: 'Artikel', icon: BookOutlined, element: Dashboard.Article },
      { path: '/village-potential', label: 'Potensi Desa ', icon: NodeIndexOutlined, element: Dashboard.VillagePotential },
      { path: '/legal-products', label: 'Produk Hukum ', icon: PaperClipOutlined, element: Dashboard.LegalProducts }
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
