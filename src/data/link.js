import { Action, Role } from '@/constants';
import * as Model from '@/models';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import env from '@/utils/env';
import { AlignLeftOutlined, BlockOutlined, DashboardOutlined, FieldTimeOutlined, FilterOutlined, TableOutlined, TranslationOutlined, UserAddOutlined, UserSwitchOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    path: '/',
    element: Landing.Home
  },
  {
    label: 'Open Data',
    path: '/data-search',
    element: Landing.CariData
  },
  {
    label: 'Data Spasial',
    path: '/spatial-data',
    element: Landing.SpatialData
  },
  {
    label: 'Sektor',
    path: '/sector',
    element: Landing.Sector
  },
  {
    label: 'Instansi',
    path: '/agency',
    element: Landing.Agency
  }
];
env.dev(() =>
  landingLink.push({
    label: 'Peta',
    path: '/map',
    element: Landing.Map
  })
);

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
    children: [{ path: '/dashboard', label: 'Dashboard', icon: DashboardOutlined, element: Dashboard.DashboardIndex }]
  },
  {
    label: 'Data Master',
    children: [
      {
        path: '/dashboard/sector',
        label: 'Sektor',
        icon: BlockOutlined,
        element: Dashboard.Sector,
        permissions: [[Action.READ, Model.Sector]]
      },
      {
        path: '/dashboard/indicator',
        label: 'Indikator',
        icon: AlignLeftOutlined,
        element: Dashboard.Indicator,
        permissions: [[Action.READ, Model.Indicator]]
      },
      {
        path: '/dashboard/subject',
        label: 'Subjek',
        icon: TranslationOutlined,
        element: Dashboard.Subject,
        permissions: [[Action.READ, Model.Subject]]
      },
      {
        path: '/dashboard/timeframe',
        label: 'Antar Waktu',
        icon: FieldTimeOutlined,
        element: Dashboard.Timeframe,
        permissions: [[Action.READ, Model.Timeframe]]
      },
      {
        path: '/dashboard/periode',
        label: 'Periode',
        icon: FieldTimeOutlined,
        element: Dashboard.Period,
        permissions: [[Action.READ, Model.Period]]
      }
    ]
  },
  {
    label: 'Manajemen Pengguna',
    children: [
      {
        path: '/dashboard/province',
        label: 'OPD Provinsi',
        icon: UserAddOutlined,
        element: Dashboard.ProvinceAgency,
        permissions: [[Action.READ, Model.ProvinceAgency]]
      },
      {
        path: '/dashboard/regency',
        label: 'OPD Kabupaten/Kota',
        icon: UserAddOutlined,
        element: Dashboard.RegencyAgency,
        permissions: [[Action.READ, Model.RegencyAgency]]
      },
      {
        path: '/dashboard/enumerator',
        label: 'Enumerator',
        icon: UserSwitchOutlined,
        element: Dashboard.Enumerator,
        permissions: [[Action.READ, Model.Enumerator]]
      },
      {
        path: '/dashboard/operator',
        label: 'Operator',
        icon: UserSwitchOutlined,
        element: Dashboard.Operator,
        permissions: [
          [Action.READ, Model.ProvinceOperator],
          [Action.READ, Model.RegencyOperator]
        ],
        roles: [Role.PROVINCE_AGENCY, Role.REGENCY_AGENCY]
      }
    ]
  },
  {
    label: 'Data Spasial',
    children: [
      {
        path: '/dashboard/subsector',
        label: 'Sektor Spasial',
        icon: UserAddOutlined,
        element: Dashboard.SubSector,
        permissions: [[Action.READ, Model.SubSector]]
      },
      {
        path: '/dashboard/datarefined',
        label: 'Olahan Spasial',
        icon: FilterOutlined,
        element: Dashboard.DataRefined,
        permissions: [[Action.READ, Model.DataRefined]]
      },
      {
        path: '/dashboard/spatialresult',
        label: 'Hasil Spasial',
        icon: TableOutlined,
        element: Dashboard.SpatialResult,
        permissions: [[Action.READ, Model.SpatialResult]]
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
  },
  {
    path: '/auth/forget-password',
    element: Auth.ForgotPassword
  },

  {
    path: '/auth/reset-password',
    element: Auth.ResetPassword
  }
];
