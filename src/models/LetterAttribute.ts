import Model from './Model';
import { IncomingApiData as IncomingLetterType } from './LetterType';

export interface IncomingApiData {
  id: number;
  jenis_surat: IncomingLetterType;
  nama: string;
  tipe: string;
  label: string;
  placeholder: string;
  harus_diisi: 'ya' | 'tidak';
  opsi: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  jenis_surat_id: number;
  nama: string;
  label: string;
  placeholder: string;
  tipe: string;
  harus_diisi: 'ya' | 'tidak';
}

interface FormValue {
  _method?: 'PUT';
  letter_type: number;
  attribute: string;
  type: string;
  label: string;
  placeholder: string;
  required: 'ya' | 'tidak';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class LetterAttribute extends Model {
  constructor(
    public id: number,
    public letter_type: {
      id: number;
      letter_name: string;
      letter_code: string;
      show_header: 'ya' | 'tidak';
      expired: number;
      signature_desc: string;
    },
    public attribute: string,
    public type: string,
    public label: string,
    public placeholder: string,
    public required: 'ya' | 'tidak',
    public opsi: string | null
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, LetterAttribute> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, LetterAttribute>;
    return new LetterAttribute(
      apiData.id,
      {
        id: apiData.jenis_surat.id,
        letter_name: apiData.jenis_surat.nama_surat,
        letter_code: apiData.jenis_surat.kode_surat,
        show_header: apiData.jenis_surat.tampilkan_header,
        expired: apiData.jenis_surat.masa_berlaku,
        signature_desc: apiData.jenis_surat.keterangan_tanda_tangan
      },
      apiData.nama,
      apiData.tipe,
      apiData.label,
      apiData.placeholder,
      apiData.harus_diisi,
      apiData.opsi
    ) as ReturnType<T, IncomingApiData, LetterAttribute>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(letterAttribute: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(letterAttribute)) return letterAttribute.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(letterAttribute._method ? { _method: letterAttribute._method } : {}),
      nama: letterAttribute.attribute,
      jenis_surat_id: letterAttribute.letter_type,
      tipe: letterAttribute.type,
      label: letterAttribute.label,
      harus_diisi: letterAttribute.required,
      placeholder: letterAttribute.placeholder
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.atribut_surat = LetterAttribute;
