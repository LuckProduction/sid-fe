import { DatatableColumn, FormField as FormFieldType, Override } from '@/types';
import strings from '@/utils/strings';
import { DescriptionsItemType } from 'antd/es/descriptions';
import Model from './Model';
import { InputType } from '@/constants';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  perangkat_desa_id: {
    nama: string;
    foto: string;
    jabatan: {
      id: number;
      nama_jabatan: string;
      kode_jabatan: number;
      golongan: string;
      tupoksi_jabatan: string;
    };
  };
  profil_desa_id: {
    nama_desa: string;
    kode_desa: number;
  };
  konten: string;
}

export interface OutgoingApiData {
  konten: string;
}

interface FormValue {
  content: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Speech extends Model {
  constructor(
    public id: number,
    public village_officials: {
      name: string;
      foto: string;
      employment: {
        id: number;
        employment_name: string;
        employment_code: number;
        faction: string;
        employment_duties: string;
      };
    },
    public villagee_profile: {
      village_name: string;
      village_code: number;
    },
    public content: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Speech> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Speech>;
    return new Speech(
      apiData.id,
      {
        name: apiData.perangkat_desa_id.nama,
        foto: asset(apiData.perangkat_desa_id.foto),
        employment: {
          id: apiData.perangkat_desa_id.jabatan.id,
          employment_name: apiData.perangkat_desa_id.jabatan.nama_jabatan,
          employment_code: apiData.perangkat_desa_id.jabatan.kode_jabatan,
          faction: apiData.perangkat_desa_id.jabatan.golongan,
          employment_duties: apiData.perangkat_desa_id.jabatan.tupoksi_jabatan
        }
      },
      {
        village_name: apiData.profil_desa_id.nama_desa,
        village_code: apiData.profil_desa_id.kode_desa
      },
      apiData.konten
    ) as ReturnType<T, IncomingApiData, Speech>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(speech: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(speech)) return speech.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      konten: speech.content
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
// Model.children.sambutan = Speech;
