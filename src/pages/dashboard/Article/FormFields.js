import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Judul ${Modul.ARTICLE}`,
    name: 'title',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul ${Modul.ARTICLE} harus diisi`
      }
    ]
  },
  {
    label: `Status ${Modul.ARTICLE}`,
    name: 'status',
    type: InputType.SELECT,
    options: [
      {
        label: 'Draft',
        value: 'draft'
      },
      {
        label: 'Publish',
        value: 'publish'
      }
    ],
    rules: [
      {
        required: true,
        message: `Status ${Modul.ARTICLE} harus diisi`
      }
    ]
  },
  {
    label: `Kategori ${Modul.ARTICLE}`,
    name: 'category',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Kategori ${Modul.ARTICLE} harus diisi`
      }
    ],
    options: options.category.map((item) => ({
      label: item.category_name,
      value: item.id
    }))
  },
  {
    label: `Gambar ${Modul.ARTICLE}`,
    name: 'image',
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
    accept: ['.png', '.jpg', '.jpeg', 'webp'],
    rules: [{ required: true, message: 'Gambar harus diisi' }]
  },
  {
    label: `Tag ${Modul.ARTICLE}`,
    name: 'tag',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Tag ${Modul.ARTICLE} harus diisi`
      }
    ]
  },
  {
    label: `Konten ${Modul.ARTICLE}`,
    name: 'content',
    type: InputType.CONTENT_EDITOR,
    rules: [
      {
        required: true,
        message: `Konten ${Modul.ARTICLE} harus diisi`
      }
    ]
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
