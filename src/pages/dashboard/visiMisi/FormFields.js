import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Konten ${Modul.VISI_MISI}`,
    name: 'content',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Konten ${Modul.VISI_MISI} harus diisi`
      }
    ]
  },
  {
    label: `Tipe ${Modul.VISI_MISI}`,
    name: 'type',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Tipe ${Modul.VISI_MISI} harus diisi`
      }
    ],
    options: [
      {
        label: 'Visi',
        value: 'visi'
      },
      {
        label: 'Misi',
        value: 'misi'
      }
    ]
  }
];
