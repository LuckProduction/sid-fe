import Model from './Model';
import { IncomingApiData as IncomingLetterType } from './LetterType';
import { IncomingApiData as IncomingResident } from './Resident';
import api from '@/utils/api';

export interface IncomingApiData {
  id: number;
  token: string;
  jenis_surat_id: IncomingLetterType;
  master_penduduk_id: IncomingResident;
  atribut_permohonan_surat: {
    id: number;
    nama_atribut: string;
    atribut_surat_id: number;
    konten: string;
  }[];
  status: string;
  link_download: string | null;
}

export interface OutgoingApiData {
  _method: string;
  master_penduduk_id?: number | null;
  jenis_surat_id?: number | null;
  atribut_permohonan_surat?:
    | {
        atribut_surat_id?: number | null;
        konten?: string | null;
      }[]
    | null;
  status: string | null;
}

interface FormValue {
  _method: string;
  resident?: number | null;
  letter_type?: number | null;
  letter_attribute?:
    | {
        letter_attribute_id?: number | null;
        content?: string | null;
      }[]
    | null;
  status: string | null;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class SubmitLetter extends Model {
  constructor(
    public id: number,
    public token: string,
    public letter_type: {
      id: number;
      letter_name: string;
      letter_code: string;
      show_header: 'ya' | 'tidak';
      expired: number;
      signature_desc: string;
    },
    public resident: {
      id: number;
      nik: number;
      full_name: string;
      family_relation: string;
      resident_status: 'tetap' | 'tidak tetap';
      marital_status: 'menikah' | 'belum menikah';
      kk_number: number;
      gender: string;
      religion: string;
    },
    public letter_attribute: {
      id: number;
      attribute_name: string;
      letter_attribute_id: number;
      content: string;
    }[],
    public status: string,
    public download_link: string | null
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, SubmitLetter> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, SubmitLetter>;
    return new SubmitLetter(
      apiData.id,
      apiData.token,
      {
        id: apiData.jenis_surat_id.id,
        letter_name: apiData.jenis_surat_id.nama_surat,
        letter_code: apiData.jenis_surat_id.kode_surat,
        expired: apiData.jenis_surat_id.masa_berlaku,
        show_header: apiData.jenis_surat_id.tampilkan_header,
        signature_desc: apiData.jenis_surat_id.keterangan_tanda_tangan
      },
      {
        id: apiData.master_penduduk_id.id,
        full_name: apiData.master_penduduk_id.nama_lengkap,
        nik: apiData.master_penduduk_id.nik,
        family_relation: apiData.master_penduduk_id.hubungan_keluarga,
        resident_status: apiData.master_penduduk_id.status_penduduk,
        marital_status: apiData.master_penduduk_id.status_perkawinan,
        kk_number: apiData.master_penduduk_id.nomor_kk,
        gender: apiData.master_penduduk_id.jenis_kelamin,
        religion: apiData.master_penduduk_id.agama
      },
      apiData.atribut_permohonan_surat.map((item) => ({
        id: item.id,
        attribute_name: item.nama_atribut,
        letter_attribute_id: item.atribut_surat_id,
        content: item.konten
      })),
      apiData.status,
      apiData.link_download
    ) as ReturnType<T, IncomingApiData, SubmitLetter>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(submitLetter: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(submitLetter)) return submitLetter.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      _method: submitLetter._method ?? null,
      master_penduduk_id: submitLetter.resident ?? null,
      jenis_surat_id: submitLetter.letter_type ?? null,
      atribut_permohonan_surat:
        submitLetter.letter_attribute?.map((item) => ({
          atribut_surat_id: item.letter_attribute_id ?? null,
          konten: item.content ?? null
        })) ?? null,
      status: submitLetter.status ?? null
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.permohonan_surat = SubmitLetter;
