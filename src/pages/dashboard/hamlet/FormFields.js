import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.HAMLET}`,
    name: 'hamlet_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.HAMLET} harus diisi`
      }
    ]
  },
  {
    label: `Nama Kepala ${Modul.HAMLET}`,
    name: 'head_hamlet_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Kepala ${Modul.HAMLET} harus diisi`
      }
    ]
  },
  {
    label: `Nik Kepala ${Modul.HAMLET}`,
    name: 'head_hamlet_nik',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nik Kepala ${Modul.HAMLET} harus diisi`
      },
      {
        validator: (_, value) => {
          if (!value) {
            return Promise.resolve();
          }
          if (!/^\d+$/.test(value)) {
            return Promise.reject(`Nik Kepala ${Modul.HAMLET} harus berupa angka`);
          }
          return Promise.resolve();
        }
      }
    ]
  },
  {
    label: `File Batas ${Modul.HAMLET}`,
    name: 'administrative_area',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.administrative_area,
          name: data?.name
        }
      ];
    },
    accept: ['.geojson'],
    rules: [{ required: true, message: `File Batas ${Modul.HAMLET} harus diisi` }]
  }
];
