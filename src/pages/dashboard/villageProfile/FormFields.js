import { InputType } from '@/constants';

export const districtFormFields = () => [
  {
    label: 'Kode Kecamatan',
    name: 'district_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Kode Kecamatan harus diisi'
      }
    ]
  },
  {
    label: 'Nama Camat',
    name: 'districthead_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Nama Camat harus diisi'
      }
    ]
  }
];

export const regencyFormFields = () => [
  {
    label: 'Kode Kabupaten',
    name: 'regency_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Kode Kabupaten harus diisi'
      }
    ]
  },
  {
    label: 'Nama Bupati',
    name: 'regencyhead_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Nama Bupati harus diisi'
      }
    ]
  }
];

export const villageFormFields = () => [
  {
    label: 'Nama Desa',
    name: 'village_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Nama desa harus diisi'
      }
    ]
  },
  {
    label: 'Kode Desa',
    name: 'village_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Kode desa harus diisi'
      }
    ]
  },
  {
    label: 'Kode Pos',
    name: 'postal_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Kode pos harus diisi'
      }
    ]
  },
  {
    label: 'Alamat Kantor',
    name: 'office_address',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Alamat kantor harus diisi'
      }
    ]
  },
  {
    label: 'Email Desa',
    name: 'village_email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Email desa harus diisi'
      },
      {
        tyoe: 'email',
        message: 'Field harus berupa email'
      }
    ]
  }
];

export const logoFormFields = () => [
  {
    label: `Logo Desa`,
    name: 'village_logo',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.village_logo,
          name: data?.name
        }
      ];
    },
    accept: ['.png', '.jpg', '.jpeg'],
    rules: [{ required: true, message: 'Logo harus diisi' }]
  }
];

export const speechFormFields = () => [
  {
    label: 'Kata Sambutan',
    name: 'content',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: 'Kata Sambutan harus diisi'
      }
    ]
  }
];
