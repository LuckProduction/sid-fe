import Model from './Model';
import { IncomingApiData as ResidentIncoming } from './Resident';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  master_penduduk_id: ResidentIncoming;
  user_id: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
  };
  status: 'aktif' | 'nonaktif';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Comunity extends Model {
  constructor(
    public id: number,
    public resident: {
      id: number;
      nik: number;
      full_name: string;
      family_relation: string;
      resident_status: 'tetap' | 'tidak tetap';
      marital_status: 'menikah' | 'belum menikah';
      kk_number: number;
      image_profile: string;
      gender: string;
      religion: string;
    },
    public user_id: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
    },
    public status: 'aktif' | 'nonaktif'
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Comunity> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Comunity>;
    return new Comunity(
      apiData.id,
      {
        id: apiData.master_penduduk_id.id,
        nik: apiData.master_penduduk_id.nik,
        full_name: apiData.master_penduduk_id.nama_lengkap,
        family_relation: apiData.master_penduduk_id.hubungan_keluarga,
        resident_status: apiData.master_penduduk_id.status_penduduk,
        marital_status: apiData.master_penduduk_id.status_perkawinan,
        kk_number: apiData.master_penduduk_id.nomor_kk,
        image_profile: asset(apiData.master_penduduk_id.foto),
        gender: apiData.master_penduduk_id.jenis_kelamin,
        religion: apiData.master_penduduk_id.agama
      },
      {
        id: apiData.user_id.id,
        name: apiData.user_id.name,
        email: apiData.user_id.email,
        email_verified_at: apiData.user_id.email_verified_at
      },
      apiData.status
    ) as ReturnType<T, IncomingApiData, Comunity>;
  }
}

Model.children.pengguna_masyarakat = Comunity;
