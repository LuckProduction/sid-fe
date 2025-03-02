import { InputType } from '@/constants';

export const biodataFormFields = () => [
  {
    label: `NIK`,
    name: 'nik',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `NIK harus diisi`
      }
    ]
  },
  {
    label: `Nomor KK`,
    name: 'kk_number',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nomor KK harus diisi`
      }
    ]
  },
  {
    label: `Nama Lengkap`,
    name: 'full_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Lengkap harus diisi`
      }
    ]
  },
  {
    label: `Hubungan Keluarga`,
    name: 'family_relation',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Hubungan Keluarga harus diisi`
      }
    ],
    options: [
      {
        label: 'Kepala Keluarga',
        value: 'kepala keluarga'
      },
      {
        label: 'Suami',
        value: 'suami'
      },
      {
        label: 'Istri',
        value: 'istri'
      },
      {
        label: 'Anak',
        value: 'anak'
      },
      {
        label: 'Mantu',
        value: 'mantu'
      },
      {
        label: 'Cucu',
        value: 'cucu'
      }
    ]
  },
  {
    label: `Status Kependudukan`,
    name: 'resident_status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status Kependudukan harus diisi`
      }
    ],
    options: [
      {
        label: 'Tetap',
        value: 'tetap'
      },
      {
        label: 'Tidak Tetap',
        value: 'tidak tetap'
      }
    ]
  },
  {
    label: `Status Pernikahan`,
    name: 'marital_status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status Pernikahan harus diisi`
      }
    ],
    options: [
      {
        label: 'Menikah',
        value: 'telah menikah'
      },
      {
        label: 'Belum Menikah',
        value: 'belum menikah'
      },
      {
        label: 'Cerai Hidup',
        value: 'cerai hidup'
      },
      {
        label: 'Cerai Mati',
        value: 'cerai mati'
      }
    ]
  },

  {
    label: `Jenis Kelamin`,
    name: 'gender',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Jenis Kelamin harus diisi`
      }
    ],
    options: [
      {
        label: 'Laki Laki',
        value: 'L'
      },
      {
        label: 'Perempuan',
        value: 'P'
      }
    ]
  },
  {
    label: `Agama`,
    name: 'religion',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Agama harus diisi`
      }
    ]
  }
];

export const addressFormField = ({ options }) => [
  {
    label: `Alamat Sesuai KK`,
    name: 'address_kk',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Alamat Sesuai KK harus diisi`
      }
    ]
  },
  {
    label: `Dusun`,
    name: 'hamlet_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Nomor KK harus diisi`
      }
    ],
    options: options.hamlet.map((item) => ({
      label: item.hamlet_name,
      value: item.id
    }))
  },
  {
    label: `RT`,
    name: 'rt',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `RT harus diisi`
      }
    ]
  },
  {
    label: `RW`,
    name: 'rw',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `RW harus diisi`
      }
    ]
  },
  {
    label: `Alamat Terakhir`,
    name: 'last_address',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Alamat Terakhir harus diisi`
      }
    ]
  },
  {
    label: `Nomor Telepon`,
    name: 'telp',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nomor Telepon harus diisi`
      }
    ]
  },
  {
    label: `Email`,
    name: 'email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Email harus diisi`
      }
    ]
  }
];

export const brithFormField = () => [
  {
    label: `Tanggal Lahir`,
    name: 'birth_date',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal Lahir harus diisi`
      }
    ]
  },
  {
    label: `Tempat Lahir`,
    name: 'birth_place',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Tempat Lahir harus diisi`
      }
    ]
  },
  {
    label: `Nomor Akta Kelahiran`,
    name: 'akta_kelahiran_number',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nomor Akta Kelahiran harus diisi`
      }
    ]
  }
];

export const parentFormFields = () => [
  {
    label: `Nama Ayah`,
    name: 'father_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Ayah harus diisi`
      }
    ]
  },
  {
    label: `NIK Ayah`,
    name: 'father_nik',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `NIK Ayah harus diisi`
      }
    ]
  },
  {
    label: `Nama Ibu`,
    name: 'mother_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Ibu harus diisi`
      }
    ]
  },
  {
    label: `NIK Ibu`,
    name: 'mother_nik',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `NIK Ibu harus diisi`
      }
    ]
  }
];

export const educationCareerFormFields = () => [
  {
    label: `Pendidikan Terakhir`,
    name: 'education_kk',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Pendidikan Terakhir harus diisi`
      }
    ]
  },
  {
    label: `Pekerjaan`,
    name: 'career',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Pekerjaan harus diisi`
      }
    ]
  },
  {
    label: `Pendidikan Sedang Ditempuh`,
    name: 'education_in_progress',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Pendidikan Sedang Ditempuh harus diisi`
      }
    ]
  }
];

export const formFields = () => {
  const form = [
    {
      label: `NIK`,
      name: 'nik',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `NIK harus diisi`
        }
      ]
    },
    {
      label: `Nomor KK`,
      name: 'kk_number',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nomor KK harus diisi`
        }
      ]
    },
    {
      label: `Nama Lengkap`,
      name: 'full_name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama Lengkap harus diisi`
        }
      ]
    },
    {
      label: `Hubungan Keluarga`,
      name: 'family_relation',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Hubungan Keluarga harus diisi`
        }
      ],
      options: [
        {
          label: 'Kepala Keluarga',
          value: 'kepala keluarga'
        },
        {
          label: 'Suami',
          value: 'suami'
        },
        {
          label: 'Istri',
          value: 'istri'
        },
        {
          label: 'Anak',
          value: 'anak'
        },
        {
          label: 'Mantu',
          value: 'mantu'
        },
        {
          label: 'Cucu',
          value: 'cucu'
        }
      ]
    },
    {
      label: `Status Kependudukan`,
      name: 'resident_status',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Status Kependudukan harus diisi`
        }
      ],
      options: [
        {
          label: 'Tetap',
          value: 'tetap'
        },
        {
          label: 'Tidak Tetap',
          value: 'tidak tetap'
        }
      ]
    },
    {
      label: `Status Pernikahan`,
      name: 'marital_status',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Status Pernikahan harus diisi`
        }
      ],
      options: [
        {
          label: 'Menikah',
          value: 'telah menikah'
        },
        {
          label: 'Belum Menikah',
          value: 'belum menikah'
        },
        {
          label: 'Cerai Hidup',
          value: 'cerai hidup'
        },
        {
          label: 'Cerai Mati',
          value: 'cerai mati'
        }
      ]
    },
    {
      label: `Jenis Kelamin`,
      name: 'gender',
      type: InputType.SELECT,
      rules: [
        {
          required: true,
          message: `Jenis Kelamin harus diisi`
        }
      ],
      options: [
        {
          label: 'Laki Laki',
          value: 'L'
        },
        {
          label: 'Perempuan',
          value: 'P'
        }
      ]
    },
    {
      label: `Agama`,
      name: 'religion',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Agama harus diisi`
        }
      ]
    }
  ];

  return [...form, ...brithFormField()];
};

export const FamilyDetailFormFields = () => [
  {
    label: `NIK`,
    name: 'nik',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `NIK harus diisi`
      }
    ]
  },
  {
    label: `Nama Lengkap`,
    name: 'full_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Lengkap harus diisi`
      }
    ]
  },
  {
    label: `Hubungan Keluarga`,
    name: 'family_relation',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Hubungan Keluarga harus diisi`
      }
    ],
    options: [
      {
        label: 'Kepala Keluarga',
        value: 'kepala keluarga'
      },
      {
        label: 'Suami',
        value: 'suami'
      },
      {
        label: 'Istri',
        value: 'istri'
      },
      {
        label: 'Anak',
        value: 'anak'
      },
      {
        label: 'Mantu',
        value: 'mantu'
      },
      {
        label: 'Cucu',
        value: 'cucu'
      }
    ]
  },
  {
    label: `Status Kependudukan`,
    name: 'resident_status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status Kependudukan harus diisi`
      }
    ],
    options: [
      {
        label: 'Tetap',
        value: 'tetap'
      },
      {
        label: 'Tidak Tetap',
        value: 'tidak tetap'
      }
    ]
  },
  {
    label: `Status Pernikahan`,
    name: 'marital_status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status Pernikahan harus diisi`
      }
    ],
    options: [
      {
        label: 'Menikah',
        value: 'telah menikah'
      },
      {
        label: 'Belum Menikah',
        value: 'belum menikah'
      },
      {
        label: 'Cerai Hidup',
        value: 'cerai hidup'
      },
      {
        label: 'Cerai Mati',
        value: 'cerai mati'
      }
    ]
  },

  {
    label: `Jenis Kelamin`,
    name: 'gender',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Jenis Kelamin harus diisi`
      }
    ],
    options: [
      {
        label: 'Laki Laki',
        value: 'L'
      },
      {
        label: 'Perempuan',
        value: 'P'
      }
    ]
  },
  {
    label: `Agama`,
    name: 'religion',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Agama harus diisi`
      }
    ]
  }
];
