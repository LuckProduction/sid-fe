import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import {
  BankOutlined,
  BookOutlined,
  DashboardOutlined,
  GiftOutlined,
  HomeOutlined,
  IdcardOutlined,
  NodeIndexOutlined,
  PaperClipOutlined,
  PartitionOutlined,
  PrinterOutlined,
  RocketOutlined,
  TableOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';

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
      { path: '/hamlet', label: 'Dusun', icon: TableOutlined, element: Dashboard.Hamlet },
      { path: '/visi-misi', label: 'Visi Misi', icon: RocketOutlined, element: Dashboard.VisiMisi }
    ]
  },
  {
    label: 'Perangkat Desa',
    children: [
      { path: '/employment', label: 'Jabatan', icon: IdcardOutlined, element: Dashboard.Employment },
      { path: '/village_officials', label: 'Perangkat Desa', icon: UsergroupAddOutlined, element: Dashboard.VillageOfficials },
      { path: '/village_institutions', label: 'Lembaga Desa', icon: BankOutlined, element: Dashboard.VillageInstitution },
      { path: '/institution_member', label: 'Anggota Lembaga', icon: UserSwitchOutlined, element: Dashboard.InstitutionMember }
    ]
  },
  {
    label: 'Kependudukan',
    children: [
      { path: '/residential', label: 'Kependudukan', icon: PartitionOutlined, element: Dashboard.Resident },
      { path: '/apbd_report', label: 'Laporan APBD', icon: PrinterOutlined, element: Dashboard.ApbdReport },
      { path: '/public_assistance', label: 'Bantuan', icon: GiftOutlined, element: Dashboard.PublicAssistance }
    ]
  },
  {
    label: 'Atikel Desa',
    children: [
      { path: '/article', label: 'Artikel', icon: BookOutlined, element: Dashboard.Article },
      { path: '/village_potential', label: 'Potensi Desa ', icon: NodeIndexOutlined, element: Dashboard.VillagePotential },
      { path: '/legal_products', label: 'Produk Hukum ', icon: PaperClipOutlined, element: Dashboard.LegalProducts }
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
