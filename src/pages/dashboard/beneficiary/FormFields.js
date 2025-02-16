import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const residentFormFields = ({ fetchResident }) => [
  {
    label: `Nama ${Modul.BENEFICIARY}`,
    name: 'beneficiary',
    type: InputType.SELECT_FETCH,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.BENEFICIARY} harus diisi`
      }
    ],
    fetchOptions: fetchResident,
    mapOptions: (item) => ({
      label: item.full_name, // Bisa disesuaikan
      value: item.id
    })
  }
];

export const institutionFormFields = ({ options }) => [
  {
    label: `Nama ${Modul.BENEFICIARY}`,
    name: 'beneficiary',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.BENEFICIARY} harus diisi`
      }
    ],
    options: options.villageInstitution.map((item) => ({
      label: item.institution_name,
      value: item.id
    }))
  }
];
