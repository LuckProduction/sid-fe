import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.EMPLOYMENT}`,
    name: 'employment_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  },
  {
    label: `Kode ${Modul.EMPLOYMENT}`,
    name: 'employment_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Kode ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  },
  {
    label: `Tupoksi ${Modul.EMPLOYMENT}`,
    name: 'employment_duties',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Tupoksi ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  },
  {
    label: `Golongan ${Modul.EMPLOYMENT}`,
    name: 'faction',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Golongan ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  }
];
