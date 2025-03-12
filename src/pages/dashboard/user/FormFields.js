import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const userFormFields = ({ options }) => [
  {
    label: `Nama ${Modul.USERS}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.USERS} harus diisi`
      }
    ]
  },
  {
    label: `Email ${Modul.USERS}`,
    name: 'email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Email ${Modul.USERS} harus diisi`
      },
      { type: 'email', message: 'Gunakan email yang valid' }
    ]
  },
  {
    label: `Role ${Modul.USERS}`,
    name: 'role',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Role ${Modul.USERS} harus diisi`
      }
    ],
    options: [
      {
        label: 'Pegawai',
        value: 'pegawai'
      },
      {
        label: 'Admin',
        value: 'admin'
      },
      {
        label: 'Masyarakat',
        value: 'masyarakat'
      }
    ]
  },
  {
    label: `Permission ${Modul.USERS}`,
    name: 'permissions',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Permission ${Modul.USERS} harus diisi`
      }
    ],
    options: options.permission.map((item) => ({
      label: item.name,
      value: item.name
    }))
  }
];

export const comunityFormFields = () => [
  {
    label: `Nama Lengkap`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama lengkap harus diisi`
      }
    ]
  },
  {
    label: `Email`,
    name: 'email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Email harus diisi`
      }
    ]
  }
];
