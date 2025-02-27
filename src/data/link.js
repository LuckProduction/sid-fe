import { Action } from '@/constants';
import * as Model from '@/models';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { BookOutlined, DashboardOutlined, DollarOutlined, FileOutlined, GiftOutlined, HomeOutlined, IdcardOutlined, PartitionOutlined } from '@ant-design/icons';

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
  },
  {
    label: 'Layanan Administratif',
    children: [
      {
        label: 'Surat Menyurat',
        key: '/lettering',
        element: Landing.Lettering
      },
      {
        label: 'Produk Hukum',
        key: '/legal_products',
        element: Landing.LegalProducts
      }
    ]
  },
  {
    label: 'Statistik',
    children: [
      {
        label: 'Statistik Penduduk',
        key: '/resident_statistic',
        element: Landing.ResidentStatistic
      },
      {
        label: 'Statistik APBD',
        key: '/apbd_statistik',
        element: Landing.ApdbStatistic
      }
    ]
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
        path: '/dashboard/village_profile',
        label: 'Profil',
        element: Dashboard.VillageProfile,
        permissions: [[Action.READ, Model.VillageProfile]]
      },
      {
        path: '/dashboard/hamlet',
        label: 'Wilayah Administratif',
        element: Dashboard.Hamlet,
        permissions: [[Action.READ, Model.Hamlet]]
      },
      {
        path: '/dashboard/visi-misi',
        label: 'Visi Misi Desa',
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
        path: '/dashboard/employment',
        label: 'Jabatan',
        element: Dashboard.Employment,
        permissions: [[Action.READ, Model.Employment]]
      },
      {
        path: '/dasboard/village_officials',
        label: 'Perangkat Desa',
        element: Dashboard.VillageOfficials,
        permissions: [[Action.READ, Model.VillageOfficials]]
      },
      {
        path: '/dashboard/village_institutions',
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
        path: '/dashboard/residential',
        label: 'Penduduk',
        element: Dashboard.Resident,
        permissions: [[Action.READ, Model.Resident]]
      },
      {
        path: '/dashboard/prospective_voter',
        label: 'Calon Pemilih',
        element: Dashboard.ProspectiveVoters
      }
    ]
  },
  {
    label: 'Bantuan',
    icon: GiftOutlined,
    children: [
      {
        path: '/dashboard/public_assistance',
        label: 'Bantuan',
        element: Dashboard.PublicAssistance,
        permissions: [[Action.READ, Model.PublicAssistance]]
      }
    ]
  },
  {
    label: 'Keuangan',
    icon: DollarOutlined,
    children: [
      {
        path: '/dashboard/apbd_report',
        label: 'Laporan APBD',
        element: Dashboard.ApbdReport,
        permissions: [[Action.READ, Model.ApbdReport]]
      }
    ]
  },
  {
    label: 'Atikel Desa',
    icon: BookOutlined,
    children: [
      {
        path: '/dashboard/article',
        label: 'Berita',
        element: Dashboard.Article,
        permissions: [[Action.READ, Model.Article]]
      },
      {
        path: '/dashboard/village_potential',
        label: 'Potensi Desa ',
        element: Dashboard.VillagePotential,
        permissions: [[Action.READ, Model.VillagePotential]]
      },
      {
        path: '/dashboard/legal_products',
        label: 'Produk Hukum ',
        element: Dashboard.LegalProducts,
        permissions: [[Action.READ, Model.LegalProducts]]
      }
    ]
  },
  {
    label: 'Layanan Administratif',
    icon: FileOutlined,
    children: [
      {
        path: '/dashboard/correspondence',
        label: 'Surat Menyurat',
        element: Dashboard.LetterType,
        permissions: [[Action.READ, Model.LetterTemplate]]
      },
      {
        path: '/dashboard/submit_letter',
        label: 'Permohonan Surat',
        element: Dashboard.SubmitLetter,
        permissions: [[Action.READ, Model.SubmitLetter]]
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
