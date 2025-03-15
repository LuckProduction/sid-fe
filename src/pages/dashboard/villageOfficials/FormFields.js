import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const villageOfficialsFormFields = ({ key, options, fetch }) => {
  const form = [
    {
      label: `NIP ${Modul.VILLAGE_OFFICIALS}`,
      name: 'nip',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `NIP ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ]
    },

    {
      label: `Nomor Telp ${Modul.VILLAGE_OFFICIALS}`,
      name: 'phone_number',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nomor Telp ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ]
    },
    {
      label: `Status ${Modul.VILLAGE_OFFICIALS}`,
      name: 'status',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Status ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ],
      options: [
        {
          label: 'Aktif',
          value: 'aktif'
        },
        {
          label: 'Non-Aktif',
          value: 'nonaktif'
        }
      ]
    },
    {
      label: `Jabatan ${Modul.VILLAGE_OFFICIALS}`,
      name: 'employment_id',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Jabatan ${Modul.VILLAGE_OFFICIALS} harus diisi`
        }
      ],
      options: options.employments.map((item) => ({
        label: item.employment_name,
        value: item.id
      }))
    },
    {
      label: `Gambar ${Modul.VILLAGE_OFFICIALS}`,
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
      rules: [{ required: true, message: 'Logo harus diisi' }]
    }
  ];

  if (key === 'default_create') {
    form.push(
      {
        label: `Nama ${Modul.VILLAGE_OFFICIALS}`,
        name: 'name',
        type: InputType.TEXT,
        rules: [
          {
            required: true,
            message: `Nama ${Modul.VILLAGE_OFFICIALS} harus diisi`
          }
        ]
      },
      {
        label: `Jenis Kelamin ${Modul.VILLAGE_OFFICIALS}`,
        name: 'gender',
        type: InputType.SELECT,
        rules: [
          {
            required: true,
            message: `Jenis Kelamin ${Modul.VILLAGE_OFFICIALS} harus diisi`
          }
        ],
        options: [
          {
            label: 'Laki-laki',
            value: 'L'
          },
          {
            label: 'Perempuan',
            value: 'P'
          }
        ]
      },
      {
        label: `Tempat Lahir ${Modul.VILLAGE_OFFICIALS}`,
        name: 'birth_place',
        type: InputType.TEXT,
        rules: [
          {
            required: true,
            message: `Tempat Lahir ${Modul.VILLAGE_OFFICIALS} harus diisi`
          }
        ]
      },
      {
        label: `Tanggal Lahir ${Modul.VILLAGE_OFFICIALS}`,
        name: 'birth_date',
        type: InputType.DATE,
        rules: [
          {
            required: true,
            message: `Tanggal Lahir ${Modul.VILLAGE_OFFICIALS} harus diisi`
          }
        ]
      }
    );
  }

  if (key === 'create_by_resident') {
    form.push({
      label: `Cari Data Penduduk`,
      name: 'resident',
      type: InputType.SELECT_FETCH,
      rules: [
        {
          required: true,
          message: `Data Penduduk harus diisi`
        }
      ],
      fetchOptions: fetch,
      mapOptions: (item) => ({
        label: item.full_name,
        value: item.id
      })
    });
  }

  return form;
};

export const employmentFormFields = () => [
  {
    label: `Nama ${Modul.EMPLOYMENT}`,
    name: 'employment_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  },
  {
    label: `Kode ${Modul.EMPLOYMENT}`,
    name: 'employment_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Kode ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  },
  {
    label: `Tupoksi ${Modul.EMPLOYMENT}`,
    name: 'employment_duties',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Tupoksi ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  },
  {
    label: `Golongan ${Modul.EMPLOYMENT}`,
    name: 'faction',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Golongan ${Modul.EMPLOYMENT} harus diisi`
      }
    ]
  }
];

export const villageOfficialsFilterFields = ({ options }) => [
  {
    label: `Status ${Modul.VILLAGE_OFFICIALS}`,
    name: 'status',
    type: InputType.SELECT,
    options: [
      {
        label: 'Aktif',
        value: 'aktif'
      },
      {
        label: 'Non-Aktif',
        value: 'nonaktif'
      }
    ]
  },
  {
    label: `Jabatan ${Modul.VILLAGE_OFFICIALS}`,
    name: 'jabatan_id',
    type: InputType.SELECT,
    options: options.employments.map((item) => ({
      label: item.employment_name,
      value: item.id
    }))
  }
];
