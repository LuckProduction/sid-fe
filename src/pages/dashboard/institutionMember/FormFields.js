import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const institutionMemberFormFields = ({ options, fetchResident }) => [
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
    type: InputType.SELECT_FETCH,
    rules: [
      {
        required: true,
        message: `Nama Anggota harus diisi`
      }
    ],
    fetchOptions: fetchResident,
    mapOptions: (item) => ({
      label: item.full_name, // Bisa disesuaikan
      value: item.id
    })
  },
  {
    label: `Foto Anggota`,
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
    accept: ['.png', '.jpg', '.jpeg', 'webp']
  }
];
