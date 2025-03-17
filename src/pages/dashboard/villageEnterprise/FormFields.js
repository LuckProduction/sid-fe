import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ fetchResident }) => [
  {
    label: `Nama ${Modul.VILLAGE_ENTERPRISE}`,
    name: 'enterprise_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.VILLAGE_ENTERPRISE} harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi ${Modul.VILLAGE_ENTERPRISE}`,
    name: 'desc',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi ${Modul.VILLAGE_ENTERPRISE} harus diisi`
      }
    ]
  },
  {
    label: `Jam Operasional ${Modul.VILLAGE_ENTERPRISE}`,
    name: 'operational_time',
    type: InputType.TIME_RANGE,
    rules: [
      {
        required: true,
        message: `Jam Operasional ${Modul.VILLAGE_ENTERPRISE} harus diisi`
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
    label: `Foto ${Modul.ARTICLE}`,
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
    rules: [{ required: true, message: 'Foto harus diisi' }]
  },
  {
    label: `Nama Pemilik`,
    name: 'resident',
    type: InputType.SELECT_FETCH,
    rules: [
      {
        required: true,
        message: `Nama Pemilik harus diisi`
      }
    ],
    fetchOptions: fetchResident,
    mapOptions: (item) => ({
      label: item.full_name,
      value: item.id
    })
  },
  {
    label: `Kontak ${Modul.VILLAGE_ENTERPRISE}`,
    name: 'contact',
    type: InputType.NUMBER,
    rules: [
      {
        required: true,
        message: `Kontak ${Modul.VILLAGE_ENTERPRISE} harus diisi`
      },
      {
        validator: (_, value) => {
          if (!value || /^628\d{7,10}$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Nomor telepon harus diawali dengan 628 dan memiliki 10-13 digit'));
        }
      }
    ]
  }
];
