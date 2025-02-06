import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { BookOutlined, DashboardOutlined, HomeOutlined, IdcardOutlined, PartitionOutlined } from '@ant-design/icons';

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
    icon: DashboardOutlined,
    children: [{ path: '/dashboard', label: 'Dashboard', element: Dashboard.Dashboard }]
  },
  {
    label: 'Pengaturan Desa',
    icon: HomeOutlined,
    children: [
      { path: '/village_profile', label: 'Profil', element: Dashboard.VillageProfile },
      { path: '/hamlet', label: 'Dusun', element: Dashboard.Hamlet },
      { path: '/visi-misi', label: 'Visi Misi', element: Dashboard.VisiMisi }
    ]
  },
  {
    label: 'Perangkat Desa',
    icon: IdcardOutlined,
    children: [
      { path: '/employment', label: 'Jabatan', element: Dashboard.Employment },
      { path: '/village_officials', label: 'Perangkat Desa', element: Dashboard.VillageOfficials },
      { path: '/village_institutions', label: 'Lembaga Desa', element: Dashboard.VillageInstitution }
    ]
  },
  {
    label: 'Kependudukan',
    icon: PartitionOutlined,
    children: [
      { path: '/residential', label: 'Kependudukan', element: Dashboard.Resident },
      { path: '/apbd_report', label: 'Laporan APBD', element: Dashboard.ApbdReport },
      { path: '/public_assistance', label: 'Bantuan', element: Dashboard.PublicAssistance }
    ]
  },
  {
    label: 'Atikel Desa',
    icon: BookOutlined,
    children: [
      { path: '/article', label: 'Artikel', element: Dashboard.Article },
      { path: '/village_potential', label: 'Potensi Desa ', element: Dashboard.VillagePotential },
      { path: '/legal_products', label: 'Produk Hukum ', element: Dashboard.LegalProducts }
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
