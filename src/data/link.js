import { Action } from '@/constants';
import * as Model from '@/models';
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
      {
        path: '/village_profile',
        label: 'Profil',
        element: Dashboard.VillageProfile,
        permissions: [[Action.READ, Model.VillageProfile]]
      },
      {
        path: '/hamlet',
        label: 'Dusun',
        element: Dashboard.Hamlet,
        permissions: [[Action.READ, Model.Hamlet]]
      },
      {
        path: '/visi-misi',
        label: 'Visi Misi',
        element: Dashboard.VisiMisi,
        permissions: [[Action.READ, Model.VisiMisi]]
      }
    ]
  },
  {
    label: 'Perangkat Desa',
    icon: IdcardOutlined,
    children: [
      {
        path: '/employment',
        label: 'Jabatan',
        element: Dashboard.Employment,
        permissions: [[Action.READ, Model.Employment]]
      },
      {
        path: '/village_officials',
        label: 'Perangkat Desa',
        element: Dashboard.VillageOfficials,
        permissions: [[Action.READ, Model.VillageOfficialse]]
      },
      {
        path: '/village_institutions',
        label: 'Lembaga Desa',
        element: Dashboard.VillageInstitution,
        permissions: [[Action.READ, Model.VillageInstitution]]
      }
    ]
  },
  {
    label: 'Kependudukan',
    icon: PartitionOutlined,
    children: [
      {
        path: '/residential',
        label: 'Kependudukan',
        element: Dashboard.Resident,
        permissions: [[Action.READ, Model.Resident]]
      },
      {
        path: '/apbd_report',
        label: 'Laporan APBD',
        element: Dashboard.ApbdReport,
        permissions: [[Action.READ, Model.ApbdReport]]
      },
      {
        path: '/public_assistance',
        label: 'Bantuan',
        element: Dashboard.PublicAssistance,
        permissions: [[Action.READ, Model.PublicAssistance]]
      }
    ]
  },
  {
    label: 'Atikel Desa',
    icon: BookOutlined,
    children: [
      {
        path: '/article',
        label: 'Artikel',
        element: Dashboard.Article,
        permissions: [[Action.READ, Model.Article]]
      },
      {
        path: '/village_potential',
        label: 'Potensi Desa ',
        element: Dashboard.VillagePotential,
        permissions: [[Action.READ, Model.VillagePotential]]
      },
      {
        path: '/legal_products',
        label: 'Produk Hukum ',
        element: Dashboard.LegalProducts,
        permissions: [[Action.READ, Model.LegalProducts]]
      }
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
