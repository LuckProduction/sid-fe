import { InputType } from '@/constants';

const getInputType = (type) => {
  switch (type) {
    case 'teks':
      return InputType.TEXT;
    case 'angka':
      return InputType.NUMBER;
    case 'tanggal':
      return InputType.DATE;
    case 'dokumen':
      return InputType.UPLOAD;
    default:
      return InputType.TEXT;
  }
};

export const mapLetterAttributesToFormFields = (letter_attribut) => {
  return letter_attribut.map((attr) => {
    // Khusus untuk type 'dokumen'
    if (attr.type === 'dokumen') {
      return {
        label: attr.label,
        name: attr.attribute,
        type: getInputType(attr.type),
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
        rules: attr.required === 'ya' ? [{ required: true, message: `${attr.label} harus diisi` }] : []
      };
    }

    // Untuk type selain 'dokumen'
    return {
      label: attr.label,
      name: attr.attribute,
      type: getInputType(attr.type),
      rules: attr.required === 'ya' ? [{ required: true, message: `${attr.label} harus diisi` }] : []
    };
  });
};
