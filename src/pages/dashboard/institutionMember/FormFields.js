import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const institutionMemberFormFields = ({ options }) => [
  {
    label: `${Modul.EMPLOYMENT}`,
    name: 'employment',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `${Modul.EMPLOYMENT} harus diisi`
      }
    ],
    options: options.employment.map((item) => ({
      label: item.employment_name,
      value: item.id
    }))
  },
  {
    label: `Nama Anggota`,
    name: 'resident',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Nama Anggota harus diisi`
      }
    ],
    options: options.resident.map((item) => ({
      label: item.full_name,
      value: item.id
    }))
  },
  {
    label: `Gambar ${Modul.ARTICLE}`,
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
  }
];
