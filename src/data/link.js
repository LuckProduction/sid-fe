import { Action } from '@/constants';
import * as Model from '@/models';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { BookOutlined, DashboardOutlined, DollarOutlined, FileOutlined, HomeOutlined, IdcardOutlined, PartitionOutlined, PushpinOutlined, UserOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    key: '/',
    element: Landing.Home
  },
  {
    label: 'Tentang Desa',
    children: [
      {
        label: 'Berita',
        key: '/news',
        element: Landing.News
      },
      {
        label: 'Produk Hukum',
        key: '/legal_products',
        element: Landing.LegalProducts
      },
      {
        label: 'Perangkat Desa',
        key: '/village_officials',
        element: Landing.VillageOfficials
      },
      {
        label: 'Lapak BUMDes',
        key: '/village_enterprises',
        element: Landing.VillageEnterprise
      },
      {
        label: 'Potensi',
        key: '/village_potentials',
        element: Landing.VillagePotential
      }
    ]
  },
  {
    label: 'Surat Menyurat',
    key: '/letterings',
    element: Landing.Lettering
  },
  {
    label: 'Bantuan',
    key: '/public_assistances',
    element: Landing.BrowseBeneficiary
  },
  {
    label: 'Statistik',
    children: [
      {
        label: 'Statistik Penduduk',
        key: '/resident_statistics',
        element: Landing.ResidentStatistic
      },
      {
        label: 'Statistik APBDes',
        key: '/apbd_statistics',
        element: Landing.ApbdStatistic
      }
    ]
  },
  {
    label: 'Pemetaan',
    children: [
      {
        label: 'Pemetaan',
        key: '/maps',
        element: Landing.Map
      },
      {
        label: 'Batas Desa',
        key: '/village_boundaries',
        element: Landing.VillageBoundaries
      }
    ]
  },
  {
    label: 'Pengaduan',
    key: '/citizen_reports',
    element: Landing.CitizenReport
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
        path: '/dashboard/visi_misi',
        label: 'Visi Misi Desa',
        element: Dashboard.VisiMisi,
        permissions: [[Action.READ, Model.VisiMisi]]
      }
    ]
  },
  {
    label: 'Pengguna',
    icon: UserOutlined,
    children: [
      {
        path: '/dashboard/user',
        label: 'Pegawai',
        element: Dashboard.User,
        permissions: [[Action.READ, Model.Officer]]
      },
      {
        path: '/dashboard/comunity',
        label: 'Masyarakat',
        element: Dashboard.Comunity,
        permissions: [[Action.READ, Model.Comunity]]
      }
    ]
  },
  {
    label: 'Pemetaan',
    icon: PushpinOutlined,
    children: [
      {
        path: '/dashboard/map',
        label: 'Pemetaan',
        element: Dashboard.Map,
        permissions: [[Action.READ, Model.Map]]
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
        path: '/dashboard/family',
        label: 'Keluarga',
        element: Dashboard.Family,
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
    label: 'Keuangan',
    icon: DollarOutlined,
    children: [
      {
        path: '/dashboard/apbd_report',
        label: 'Laporan APBDes',
        element: Dashboard.ApbdReport,
        permissions: [[Action.READ, Model.ApbdReport]]
      }
    ]
  },
  {
    label: 'Artikel Desa',
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
    label: 'Layanan Masyarakat',
    icon: FileOutlined,
    children: [
      {
        path: '/dashboard/correspondence',
        label: 'Jenis Surat',
        element: Dashboard.LetterType,
        permissions: [[Action.READ, Model.LetterTemplate]]
      },
      {
        path: '/dashboard/submit_letter',
        label: 'Permohonan Surat',
        element: Dashboard.SubmitLetter,
        permissions: [[Action.READ, Model.SubmitLetter]]
      },
      {
        path: '/dashboard/citizen_report',
        label: 'Pengaduan Masyarakat',
        element: Dashboard.CitizenReport,
        permissions: [[Action.READ, Model.CitizenReport]]
      },
      {
        path: '/dashboard/citizen_report_replies',
        label: 'Balasan Pengaduan Masyarakat',
        element: Dashboard.CitizenReportReply,
        permissions: [[Action.READ, Model.CitizenReportReply]]
      },
      {
        path: '/dashboard/village_enterprise',
        label: 'Lapak BUMDes',
        element: Dashboard.VillageEnterprise,
        permissions: [[Action.READ, Model.VillageEnterprise]]
      },
      {
        path: '/dashboard/public_assistance',
        label: 'Bantuan Masyarakat',
        element: Dashboard.PublicAssistance,
        permissions: [[Action.READ, Model.PublicAssistance]]
      },
      {
        path: '/dashboard/tax_period',
        label: 'Wajib Pajak',
        element: Dashboard.TaxPeriod,
        permissions: [[Action.READ, Model.TaxPeriod]]
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
