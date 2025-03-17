import asset from '@/utils/asset';
import Model from './Model';
import { IncomingApiData as IncomingResident } from './Resident';

export interface IncomingApiData {
  id: number;
  nama_lapak: string;
  foto: string;
  deskripsi: string;
  master_penduduk_id: IncomingResident;
  titik_koordinat: string;
  kontak: string;
  jam_operasional: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama_lapak: string;
  deskripsi: string;
  titik_koordinat: string;
  foto: string;
  jam_operasional: string;
  kontak: string;
  master_penduduk_id: number;
}

interface FormValue {
  _method?: 'PUT';
  enterprise_name: string;
  desc: string;
  coordinate: string;
  foto: string;
  operational_time: string;
  contact: string;
  resident: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VillageEnterprise extends Model {
  constructor(
    public id: number,
    public enterprise_name: string,
    public foto: string,
    public desc: string,
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
    public coordinate: string,
    public contact: string,
    public operational_time: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VillageEnterprise> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VillageEnterprise>;
    return new VillageEnterprise(
      apiData.id,
      apiData.nama_lapak,
      asset(apiData.foto),
      apiData.deskripsi,
      {
        id: apiData.master_penduduk_id.id,
        nik: apiData.master_penduduk_id.nik,
        full_name: apiData.master_penduduk_id.nama_lengkap,
        family_relation: apiData.master_penduduk_id.hubungan_keluarga,
        resident_status: apiData.master_penduduk_id.status_penduduk,
        marital_status: apiData.master_penduduk_id.status_perkawinan,
        kk_number: apiData.master_penduduk_id.nomor_kk,
        gender: apiData.master_penduduk_id.jenis_kelamin,
        religion: apiData.master_penduduk_id.agama
      },
      apiData.titik_koordinat,
      apiData.kontak,
      apiData.jam_operasional
    ) as ReturnType<T, IncomingApiData, VillageEnterprise>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(villageEnterprise: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(villageEnterprise)) return villageEnterprise.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(villageEnterprise._method ? { _method: villageEnterprise._method } : {}),
      nama_lapak: villageEnterprise.enterprise_name,
      deskripsi: villageEnterprise.desc,
      titik_koordinat: villageEnterprise.coordinate,
      foto: villageEnterprise.foto,
      jam_operasional: villageEnterprise.operational_time,
      kontak: villageEnterprise.contact,
      master_penduduk_id: villageEnterprise.resident
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.lapak = VillageEnterprise;
