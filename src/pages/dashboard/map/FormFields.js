import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

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

export const mapFormFields = ({ key, options }) => {
  const formFields = [
    {
      label: `Nama Pemetaan`,
      name: 'map_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama Pemetaan harus diisi`
        }
      ]
    },
    {
      label: `Kategori`,
      name: 'category_id',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Kategori harus diisi`
        }
      ],
      options: options.category.map((item) => ({
        label: item.category_name,
        value: item.id
      }))
    },
    {
      label: `Deskripsi`,
      name: 'desc',
      type: InputType.LONGTEXT,
      rules: [
        {
          required: true,
          message: `Deskripsi harus diisi`
        }
      ]
    }
  ];

  if (key === 'titik') {
    formFields.push(
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
    );
  }

  if (key === 'area') {
    formFields.push({
      label: `File ${Modul.MAP}`,
      name: 'content',
      type: InputType.UPLOAD,
      max: 1,
      beforeUpload: () => {
        return false;
      },
      getFileList: (data) => {
        return [
          {
            url: data?.content,
            name: data?.name
          }
        ];
      },
      accept: ['.geojson'],
      rules: [{ required: true, message: `File ${Modul.MAP} harus diisi` }]
    });
  }

  return formFields;
};
