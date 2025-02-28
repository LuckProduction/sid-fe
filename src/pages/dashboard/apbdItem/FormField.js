import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.APBD_ITEM}`,
    name: 'component_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.APBD_ITEM} harus diisi`
      }
    ]
  },
  {
    label: `Bidang ${Modul.APBD_ITEM}`,
    name: 'field',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Bidang ${Modul.APBD_ITEM} harus diisi`
      }
    ]
  },
  {
    label: `Tipe`,
    name: 'type',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Tipe harus diisi`
      }
    ],
    options: [
      {
        label: 'Belanja',
        value: 'belanja'
      },
      {
        label: 'Pendapatan',
        value: 'pendapatan'
      },
      {
        label: 'Pengeluaran',
        value: 'pengeluaran'
      },
      {
        label: 'Pembiayaan',
        value: 'pembiayaan'
      }
    ]
  },
  {
    label: `Sumber Anggaran`,
    name: 'source_funding',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Sumber Anggaran harus diisi`
      }
    ]
  },
  {
    label: `Jumlah Anggaran`,
    name: 'budget_amount',
    type: InputType.NUMBER,
    rules: [
      {
        required: true,
        message: `Jumlah Anggaran harus diisi`
      }
    ]
  }
];
