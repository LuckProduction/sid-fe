import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const taxPeriodFormFields = () => [
  {
    label: `Nama ${Modul.TAX}`,
    name: 'tax_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.TAX} harus diisi`
      }
    ]
  },
  {
    label: `Tahun ${Modul.TAX_PERIOD}`,
    name: 'year',
    type: InputType.DATE,
    extra: {
      picker: 'year'
    },
    rules: [
      {
        required: true,
        message: `Tahun ${Modul.TAX_PERIOD} harus diisi`
      }
    ]
  },
  {
    label: `Tanggal mulai ${Modul.TAX_PERIOD}`,
    name: 'date_start',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal mulai ${Modul.TAX_PERIOD} harus diisi`
      }
    ]
  },
  {
    label: `Tanggal selesai ${Modul.TAX_PERIOD}`,
    name: 'date_end',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal selesai ${Modul.TAX_PERIOD} harus diisi`
      }
    ]
  },
  {
    label: `Status ${Modul.TAX}`,
    name: 'status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status ${Modul.TAX} harus diisi`
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

export const publicTaxFormFields = ({ fetchResident }) => [
  {
    label: `Nama Peserta ${Modul.TAX}`,
    name: 'resident',
    type: InputType.SELECT_FETCH,
    rules: [
      {
        required: true,
        message: `Nama peserta ${Modul.TAX} harus diisi`
      }
    ],
    fetchOptions: fetchResident,
    mapOptions: (item) => ({
      label: item.full_name,
      value: item.id
    })
  },
  {
    label: `Status ${Modul.TAX}`,
    name: 'status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status ${Modul.TAX} harus diisi`
      }
    ],
    options: [
      {
        label: 'Lunas',
        value: 'lunas'
      },
      {
        label: 'Belum Bayar',
        value: 'belum bayar'
      }
    ]
  }
];

export const taxPeriodFilterFields = () => [
  {
    label: `Tahun ${Modul.TAX_PERIOD}`,
    name: 'tahun',
    type: InputType.DATE,
    extra: {
      picker: 'year'
    }
  },
  {
    label: `Status ${Modul.TAX}`,
    name: 'status',
    type: InputType.SELECT,
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

export const publicTaxFilterFields = () => [
  {
    label: `Status ${Modul.TAX}`,
    name: 'status',
    type: InputType.SELECT,
    options: [
      {
        label: 'Lunas',
        value: 'lunas'
      },
      {
        label: 'Belum Bayar',
        value: 'belum bayar'
      }
    ]
  }
];
