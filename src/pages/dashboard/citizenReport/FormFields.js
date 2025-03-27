import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const statusFormFields = () => [
  {
    label: `Status ${Modul.CITIZEN_REPORT}`,
    name: 'status',
    type: InputType.SELECT,
    picker: 'select',
    rules: [
      {
        required: true,
        message: `Status ${Modul.CITIZEN_REPORT} harus diisi`
      }
    ],
    options: [
      {
        label: 'Privasi',
        value: 'privasi'
      },
      {
        label: 'Verifikasi',
        value: 'verifikasi'
      },
      {
        label: 'Publikasi',
        value: 'publikasi'
      },
      {
        label: 'Diproses',
        value: 'diproses'
      },
      {
        label: 'Selesai',
        value: 'selesai'
      }
    ]
  }
];

export const createFormFields = () => [
  {
    label: `Judul ${Modul.CITIZEN_REPORT}`,
    name: 'report_title',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul ${Modul.CITIZEN_REPORT} harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi ${Modul.CITIZEN_REPORT}`,
    name: 'desc',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi ${Modul.CITIZEN_REPORT} harus diisi`
      }
    ]
  },
  {
    label: `Dokumen ${Modul.CITIZEN_REPORT}`,
    name: 'doc',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.image,
          name: data?.name
        }
      ];
    },
    accept: ['.png', '.jpg', '.jpeg', 'webp', '.pdf'],
    rules: [{ required: true, message: 'Dokumen harus diisi' }]
  },
  {
    label: `NIK Pengadu `,
    name: 'nik',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'NIK wajib di isi!'
      },
      {
        pattern: /^[0-9]+$/,
        message: 'NIK harus berupa angka !'
      }
    ]
  },
  {
    label: `Status ${Modul.CITIZEN_REPORT}`,
    name: 'status',
    type: InputType.SELECT,
    picker: 'select',
    rules: [
      {
        required: true,
        message: `Status ${Modul.CITIZEN_REPORT} harus diisi`
      }
    ],
    options: [
      {
        label: 'Privasi',
        value: 'privasi'
      },
      {
        label: 'Publikasi',
        value: 'publikasi'
      }
    ]
  }
];

export const citizenReportsFilterFields = () => [
  {
    label: `Status ${Modul.CITIZEN_REPORT}`,
    name: 'status',
    type: InputType.SELECT,
    picker: 'select',
    options: [
      {
        label: 'Privasi',
        value: 'privasi'
      },
      {
        label: 'Verifikasi',
        value: 'verifikasi'
      },
      {
        label: 'Publikasi',
        value: 'publikasi'
      },
      {
        label: 'Diproses',
        value: 'diproses'
      },
      {
        label: 'Selesai',
        value: 'selesai'
      }
    ]
  }
];
