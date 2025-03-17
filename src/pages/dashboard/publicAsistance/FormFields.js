import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.PUBLIC_ASSISTANCE}`,
    name: 'public_assistance_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.PUBLIC_ASSISTANCE} harus diisi`
      }
    ]
  },
  {
    label: `Sasaran ${Modul.PUBLIC_ASSISTANCE}`,
    name: 'program_target',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Sasaran ${Modul.PUBLIC_ASSISTANCE} harus diisi`
      }
    ],
    options: [
      {
        label: 'Penduduk',
        value: 'penduduk'
      },
      {
        label: 'Kartu Keluarga',
        value: 'kartu keluarga'
      },
      {
        label: 'Lembaga',
        value: 'lembaga'
      }
    ]
  },
  {
    label: `Asal Dana`,
    name: 'source_funding',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Asal Dana harus diisi`
      }
    ],
    options: [
      {
        label: 'Pusat',
        value: 'pusat'
      },
      {
        label: 'Provinsi',
        value: 'provinsi'
      },
      {
        label: 'Kabupaten',
        value: 'kabupaten'
      },
      {
        label: 'Kota',
        value: 'kota'
      },
      {
        label: 'Dana Desa',
        value: 'dana desa'
      },
      {
        label: 'Lain Lain',
        value: 'lain-lain'
      }
    ]
  },
  {
    label: `Status`,
    name: 'status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status harus diisi`
      }
    ],
    options: [
      {
        label: 'Aktif',
        value: 'aktif'
      },
      {
        label: 'Nonaktif',
        value: 'nonaktif'
      }
    ]
  },
  {
    label: `Keterangan ${Modul.PUBLIC_ASSISTANCE}`,
    name: 'description',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Keterangan ${Modul.PUBLIC_ASSISTANCE} harus diisi`
      }
    ]
  }
];

export const publicAssistanceFilterFields = () => [
  {
    label: `Asal Dana`,
    name: 'asal_dana',
    type: InputType.SELECT,
    options: [
      {
        label: 'Pusat',
        value: 'pusat'
      },
      {
        label: 'Provinsi',
        value: 'provinsi'
      },
      {
        label: 'Kabupaten',
        value: 'kabupaten'
      },
      {
        label: 'Kota',
        value: 'kota'
      },
      {
        label: 'Dana Desa',
        value: 'dana desa'
      },
      {
        label: 'Lain Lain',
        value: 'lain-lain'
      }
    ]
  },
  {
    label: `Sasaran ${Modul.PUBLIC_ASSISTANCE}`,
    name: 'sasaran_program',
    type: InputType.SELECT,
    options: [
      {
        label: 'Penduduk',
        value: 'penduduk'
      },
      {
        label: 'Kartu Keluarga',
        value: 'kartu keluarga'
      },
      {
        label: 'Lembaga',
        value: 'lembaga'
      }
    ]
  }
];
