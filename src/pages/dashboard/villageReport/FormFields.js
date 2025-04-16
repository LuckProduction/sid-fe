import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.VILLAGE_REPORT}`,
    name: 'report_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.VILLAGE_REPORT} harus diisi`
      }
    ]
  },
  {
    label: `Tipe ${Modul.VILLAGE_REPORT}`,
    name: 'type',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Tipe ${Modul.VILLAGE_REPORT} harus diisi`
      }
    ],
    options: [
      {
        label: 'Ubah',
        value: 'ubah'
      },
      {
        label: 'Masuk',
        value: 'masuk'
      },
      {
        label: 'Keluar',
        value: 'keluar'
      },
      {
        label: 'Lahir',
        value: 'lahir'
      },
      {
        label: 'Meninggal',
        value: 'meninggal'
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
        label: 'Non Aktif',
        value: 'nonaktif'
      }
    ]
  }
];
export const reportAttributeFormFields = () => [
  {
    label: `Nama ${Modul.REPORT_ATTRIBUTE}`,
    name: 'attribute_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.REPORT_ATTRIBUTE} harus diisi`
      }
    ]
  },
  {
    label: `Tipe ${Modul.REPORT_ATTRIBUTE}`,
    name: 'type',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Tipe ${Modul.REPORT_ATTRIBUTE} harus diisi`
      }
    ],
    options: [
      {
        label: 'Teks',
        value: 'teks'
      },
      {
        label: 'Angka',
        value: 'angka'
      },
      {
        label: 'Tanggal',
        value: 'tanggal'
      },
      {
        label: 'Dokumen',
        value: 'dokumen'
      }
    ]
  },
  {
    label: `Label ${Modul.REPORT_ATTRIBUTE}`,
    name: 'label',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Label ${Modul.REPORT_ATTRIBUTE} harus diisi`
      }
    ]
  },
  {
    label: `Placeholder ${Modul.REPORT_ATTRIBUTE}`,
    name: 'placeholder',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Placeholder ${Modul.REPORT_ATTRIBUTE} harus diisi`
      }
    ]
  },
  {
    label: `Required ${Modul.REPORT_ATTRIBUTE}`,
    name: 'required',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Required ${Modul.REPORT_ATTRIBUTE} harus diisi`
      }
    ],
    options: [
      {
        label: 'Tdak',
        value: 'tidak'
      },
      {
        label: 'Ya',
        value: 'ya'
      }
    ]
  }
];

export const statusSubmitFormFields = () => [
  {
    label: `Status ${Modul.SUBMIT_LETTER}`,
    name: 'status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Status ${Modul.SUBMIT_LETTER} harus diisi`
      }
    ],
    options: [
      {
        label: 'Proses',
        value: 'proses'
      },
      {
        label: 'Terima',
        value: 'terima'
      },
      {
        label: 'Tolak',
        value: 'tolak'
      }
    ]
  }
];

export const submitReportFilterFields = ({ options }) => [
  {
    label: `Nama Laporan`,
    name: 'master_laporan_id',
    type: InputType.SELECT,
    options: options.village_report.map((item) => ({
      label: item.report_name,
      value: item.id
    }))
  },
  {
    label: `Status`,
    name: 'status',
    type: InputType.SELECT,
    options: [
      {
        label: 'Proses',
        value: 'proses'
      },
      {
        label: 'Terima',
        value: 'terima'
      },
      {
        label: 'Tolak',
        value: 'tolak'
      }
    ]
  }
];
