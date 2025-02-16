import Model from './Model';
import { IncomingApiData as IncomingLetterAttribut } from './LetterAttribute';

export interface IncomingApiData {
  id: number;
  nama_surat: string;
  kode_surat: string;
  tampilkan_header: 'ya' | 'tidak';
  masa_berlaku: number;
  keterangan_tanda_tangan: string;
  atribut_surat?: IncomingLetterAttribut[];
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama_surat: string;
  kode_surat: string;
  tampilkan_header: 'ya' | 'tidak';
  masa_berlaku: number;
  keterangan_tanda_tangan: string;
}

interface FormValue {
  _method?: 'PUT';
  letter_name: string;
  letter_code: string;
  show_header: 'ya' | 'tidak';
  expired: number;
  signature_desc: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class LetterType extends Model {
  constructor(
    public id: number,
    public letter_name: string,
    public letter_code: string,
    public show_header: 'ya' | 'tidak',
    public expired: number,
    public signature_desc: string,
    public letter_attribut?: {
      id: number;
      attribute: string;
      type: string;
      label: string;
      placeholder: string;
      required: 'ya' | 'tidak';
      opsi: string | null;
    }[]
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, LetterType> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, LetterType>;
    return new LetterType(
      apiData.id,
      apiData.nama_surat,
      apiData.kode_surat,
      apiData.tampilkan_header,
      apiData.masa_berlaku,
      apiData.keterangan_tanda_tangan,
      apiData.atribut_surat
        ? apiData.atribut_surat.map((attr) => ({
            id: attr.id,
            attribute: attr.nama,
            type: attr.tipe,
            label: attr.label,
            placeholder: attr.placeholder,
            required: attr.harus_diisi,
            opsi: attr.opsi
          }))
        : undefined
    ) as ReturnType<T, IncomingApiData, LetterType>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(letterType: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(letterType)) return letterType.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(letterType._method ? { _method: letterType._method } : {}),
      nama_surat: letterType.letter_name,
      kode_surat: letterType.letter_code,
      tampilkan_header: letterType.show_header,
      masa_berlaku: letterType.expired,
      keterangan_tanda_tangan: letterType.signature_desc
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.jenis_surat = LetterType;
