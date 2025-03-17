import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.APBD_REPORT}`,
    name: 'report_name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.APBD_REPORT} harus diisi`
      }
    ]
  },
  {
    label: `Tahun`,
    name: 'year',
    extra: {
      picker: 'year'
    },
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tahun ${Modul.APBD_REPORT} harus diisi`
      }
    ]
  },
  {
    label: `Dokumen ${Modul.APBD_REPORT}`,
    name: 'document',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.document,
          name: data?.name
        }
      ];
    },
    accept: ['.pdf'],
    rules: [{ required: true, message: 'Dokumen harus diisi' }]
  }
];

export const apbdReportFilterFields = () => [
  {
    label: `Tahun`,
    name: 'tahun',
    extra: {
      picker: 'year'
    },
    type: InputType.DATE
  }
];
