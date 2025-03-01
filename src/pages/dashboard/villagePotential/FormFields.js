import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const villagePotentialFormFields = ({ options }) => [
  {
    label: `Nama Potensi`,
    name: 'potential_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Potensi harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi`,
    name: 'description',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi harus diisi`
      }
    ]
  },
  {
    label: `Lokasi`,
    name: 'location',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Lokasi harus diisi`
      }
    ]
  },
  {
    label: `Kategori`,
    name: 'category',
    type: InputType.SELECT,
    options: options.category.map((item) => ({
      label: item.category_name,
      value: item.id
    })),
    rules: [
      {
        required: true,
        message: `Kategori harus diisi`
      }
    ]
  },
  {
    label: `Gambar ${Modul.VILLAGE_POTENTIALS}`,
    name: 'foto',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.foto,
          name: data?.name
        }
      ];
    },
    accept: ['.png', '.jpg', '.jpeg', 'webp'],
    rules: [{ required: true, message: 'Logo harus diisi' }]
  },
  {
    label: 'Lokasi',
    type: InputType.MAP_PICKER // Tipe khusus untuk MapPicker
  },
  {
    label: 'Latitude',
    name: 'latitude', // Nama field untuk latitude
    type: InputType.TEXT,
    rules: [{ required: true, message: 'Latitude harus diisi' }]
  },
  {
    label: 'Longitude',
    name: 'longitude', // Nama field untuk longitude
    type: InputType.TEXT,
    rules: [{ required: true, message: 'Longitude harus diisi' }]
  }
];

export const categoryFormFields = () => [
  {
    label: `Nama Kategori`,
    name: 'category_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Kategori harus diisi`
      }
    ]
  }
];
