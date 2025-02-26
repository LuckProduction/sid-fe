import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const letterTypeFormFields = () => [
  {
    label: `Nama Surat`,
    name: 'letter_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Surat harus diisi`
      }
    ]
  },
  {
    label: `Kode Surat`,
    name: 'letter_code',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Kode Surat harus diisi`
      }
    ]
  },
  {
    label: `Tampilkan Header (Y/N)`,
    name: 'show_header',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Pilihan harus diisi`
      }
    ],
    options: [
      {
        label: 'Ya',
        value: 'ya'
      },
      {
        label: 'Tidak',
        value: 'tidak'
      }
    ]
  },
  {
    label: `Masa Berlaku (Hari)`,
    name: 'expired',
    type: InputType.NUMBER,
    rules: [
      {
        required: true,
        message: `Masa Berlaku ${Modul.LETTER_TYPE} harus diisi`
      }
    ]
  },
  {
    label: `Keterangan Tanda Tangan`,
    name: 'signature_desc',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Keterangan Tanda Tangan ${Modul.LETTER_TYPE} harus diisi`
      }
    ]
  }
];

export const letterAttributeFormFields = () => [
  {
    label: `Nama ${Modul.LETTER_ATTRIBUTE}`,
    name: 'attribute',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.LETTER_ATTRIBUTE} harus diisi`
      }
    ]
  },
  {
    label: `Tipe ${Modul.LETTER_ATTRIBUTE}`,
    name: 'type',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Pilihan harus diisi`
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
      }
    ]
  },
  {
    label: `Label ${Modul.LETTER_ATTRIBUTE}`,
    name: 'label',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Label ${Modul.LETTER_ATTRIBUTE} harus diisi`
      }
    ]
  },
  {
    label: `Placeholder ${Modul.LETTER_ATTRIBUTE}`,
    name: 'placeholder',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Placeholder ${Modul.LETTER_ATTRIBUTE} harus diisi`
      }
    ]
  },
  {
    label: `Wajib (Y/N)`,
    name: 'required',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Pilihan harus diisi`
      }
    ],
    options: [
      {
        label: 'Ya',
        value: 'ya'
      },
      {
        label: 'Tidak',
        value: 'tidak'
      }
    ]
  }
];

export const letterTempalteFormFields = () => [
  {
    label: `Konten ${Modul.LETTER_TEMPLATE}`,
    name: 'content',
    type: InputType.DOCUMENT_EDITOR,
    rules: [
      {
        required: true,
        message: `Konten ${Modul.LETTER_TEMPLATE} harus diisi`
      }
    ]
  }
];

export const submitLetterFormFields = () => [
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
        label: 'Selesai',
        value: 'selesai'
      },
      {
        label: 'Verifikasi',
        value: 'verifikasi'
      },
      {
        label: 'Menunggu',
        value: 'menunggu'
      }
    ]
  }
];
