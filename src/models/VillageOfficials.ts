import { DatatableColumn, FormField as FormFieldType, Override } from '@/types';
import strings from '@/utils/strings';
import { DescriptionsItemType } from 'antd/es/descriptions';
import Model from './Model';
import { InputType } from '@/constants';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  nama: string;
  nip: string;
  jabatan: {
    id: number;
    nama_jabatan: string;
    kode_jabatan: string;
  };
  alamat: string;
  no_hp: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  status: string;
  foto: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama: string;
  jenis_kelamin: string;
  nip: string;
  alamat: string;
  no_hp: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  status: string;
  jabatan_id: string;
  foto: string;
}

interface FormValue {
  _method?: 'PUT';
  name: string;
  gender: string;
  nip: string;
  address: string;
  phone_number: string;
  birth_place: string;
  birth_date: string;
  status: string;
  employment_id: string;
  image: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VillageOfficials extends Model {
  constructor(
    public id: number,
    public name: string,
    public nip: string,
    public employment: {
      id: number;
      employment_name: string;
      employment_code: string;
    },
    public address: string,
    public phone_number: string,
    public birth_place: string,
    public birth_date: string,
    public gender: string,
    public status: string,
    public image: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VillageOfficials> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VillageOfficials>;
    return new VillageOfficials(
      apiData.id,
      apiData.nama,
      apiData.nip,
      {
        id: apiData.jabatan.id,
        employment_name: apiData.jabatan.nama_jabatan,
        employment_code: apiData.jabatan.kode_jabatan
      },
      apiData.alamat,
      apiData.no_hp,
      apiData.tempat_lahir,
      apiData.tanggal_lahir,
      apiData.jenis_kelamin,
      apiData.status,
      asset(apiData.foto)
    ) as ReturnType<T, IncomingApiData, VillageOfficials>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(villageOfficials: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(villageOfficials)) return villageOfficials.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(villageOfficials._method ? { _method: villageOfficials._method } : {}),
      nama: villageOfficials.name,
      jenis_kelamin: villageOfficials.gender,
      nip: villageOfficials.nip,
      alamat: villageOfficials.address,
      no_hp: villageOfficials.phone_number,
      tempat_lahir: villageOfficials.birth_place,
      tanggal_lahir: villageOfficials.birth_date,
      status: villageOfficials.status,
      jabatan_id: villageOfficials.employment_id,
      foto: villageOfficials.image
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.perangkat_desa = VillageOfficials;
