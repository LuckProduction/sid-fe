import { InputType } from '@/constants';

const validateYouTubeUrl = (_, value) => {
  const pattern = /^https:\/\/www\.youtube\.com\//;
  if (!value) {
    return Promise.reject('URL wajib diisi!');
  }
  if (!pattern.test(value)) {
    return Promise.reject('URL harus diawali dengan https://www.youtube.com/');
  }
  return Promise.resolve();
};

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
    type: InputType.TEXT
  },
  {
    label: 'Kode Desa',
    name: 'village_code',
    type: InputType.TEXT
  },
  {
    label: 'Kode Pos',
    name: 'postal_code',
    type: InputType.TEXT
  },
  {
    label: 'Alamat Kantor',
    name: 'office_address',
    type: InputType.TEXT
  },
  {
    label: 'Email Desa',
    name: 'village_email',
    type: InputType.TEXT
  },
  {
    label: 'Link Youtube Profile Desa',
    name: 'profile_video_link',
    type: InputType.TEXT,
    rules: [
      {
        validator: validateYouTubeUrl
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

export const VillageBoundariesFormFields = () => [
  {
    label: 'Batas Utara',
    name: 'north',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Batas Utara harus diisi'
      }
    ]
  },
  {
    label: 'Batas Selatan',
    name: 'south',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Batas Selatan harus diisi'
      }
    ]
  },
  {
    label: 'Batas timur',
    name: 'east',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Batas timur harus diisi'
      }
    ]
  },
  {
    label: 'Batas barat',
    name: 'west',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Batas barat harus diisi'
      }
    ]
  },
  {
    label: 'Luas Wilayah',
    name: 'area',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Luas Wilayah harus diisi'
      }
    ]
  },
  {
    label: 'Lokasi',
    type: InputType.MAP_PICKER
  },
  {
    label: 'Latitude',
    name: 'latitude',
    type: InputType.TEXT,
    rules: [{ required: true, message: 'Latitude harus diisi' }]
  },
  {
    label: 'Longitude',
    name: 'longitude',
    type: InputType.TEXT,
    rules: [{ required: true, message: 'Longitude harus diisi' }]
  },
  {
    label: `File Batas`,
    name: 'adiministrative_file',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.adiministrative_file,
          name: data?.name
        }
      ];
    },
    accept: ['.geojson']
  }
];
