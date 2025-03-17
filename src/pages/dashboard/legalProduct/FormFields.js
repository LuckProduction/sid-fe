import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Judul ${Modul.LEGAL_PRODUCTS}`,
    name: 'title',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Nomor Penetapan `,
    name: 'assignment_number',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nomor Penetapan ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Tanggal Penetapan `,
    name: 'assignment_date',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal Penetapan ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Jenis ${Modul.LEGAL_PRODUCTS}`,
    name: 'type',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Jenis ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Tahun ${Modul.LEGAL_PRODUCTS}`,
    name: 'year',
    type: InputType.DATE,
    extra: {
      picker: 'year'
    },
    rules: [
      {
        required: true,
        message: `Tahun ${Modul.LEGAL_PRODUCTS} harus diisi`
      }
    ]
  },
  {
    label: `Dokumen ${Modul.LEGAL_PRODUCTS}`,
    name: 'document',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.document,
          name: data?.name
        }
      ];
    },
    accept: ['.pdf'],
    rules: [{ required: true, message: 'Dokumen harus diisi' }]
  },
  {
    label: `Status ${Modul.LEGAL_PRODUCTS}`,
    name: 'status',
    type: InputType.SELECT,
    picker: 'select',
    rules: [
      {
        required: true,
        message: `Status ${Modul.LEGAL_PRODUCTS} harus diisi`
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

export const legalProductsFilterFields = () => [
  {
    label: `Tahun ${Modul.LEGAL_PRODUCTS}`,
    name: 'tahun',
    type: InputType.DATE,
    extra: {
      picker: 'year'
    }
  },

  {
    label: `Status ${Modul.LEGAL_PRODUCTS}`,
    name: 'status',
    type: InputType.SELECT,
    picker: 'select',
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
