import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.VILLAGE_INSTITUTION}`,
    name: 'institution_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.VILLAGE_INSTITUTION} harus diisi`
      }
    ]
  },
  {
    label: `Kode ${Modul.VILLAGE_INSTITUTION}`,
    name: 'institution_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Kode ${Modul.VILLAGE_INSTITUTION} harus diisi`
      }
    ]
  },
  {
    label: `Status ${Modul.VILLAGE_INSTITUTION}`,
    name: 'status',
    type: InputType.SELECT,
    picker: 'select',
    rules: [
      {
        required: true,
        message: `Status ${Modul.VILLAGE_INSTITUTION} harus diisi`
      }
    ],
    options: [
      {
        label: 'Aktif',
        value: 'aktif'
      },
      {
        label: 'Non-Aktif',
        value: 'nonaktif'
      }
    ]
  }
];
