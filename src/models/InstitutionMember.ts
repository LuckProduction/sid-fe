import Model from './Model';
import { IncomingApiData as IncomingVillageInstitution } from './VillageInstitution';
import { IncomingApiData as IncomingResident } from './Resident';
import { IncomingApiData as IncomingEmployment } from './Employment';
import api from '@/utils/api';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  lembaga_desa_id: IncomingVillageInstitution;
  master_penduduk_id: IncomingResident;
  jabatan_id: IncomingEmployment;
  foto: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  lembaga_desa_id: number;
  jabatan_id: number;
  master_penduduk_id: number;
  foto: string;
}

interface FormValue {
  _method?: 'PUT';
  village_institution: number;
  employment: number;
  resident: number;
  foto: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class InstitutionMember extends Model {
  constructor(
    public id: number,
    public village_institution: {
      id: number;
      institution_name: string;
      institution_code: string;
      status: string;
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
    public employment: {
      id: number;
      employment_name: string;
      employment_code: string;
      faction: string;
      employment_duties: string;
    },
    public foto: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, InstitutionMember> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, InstitutionMember>;
    return new InstitutionMember(
      apiData.id,
      {
        id: apiData.lembaga_desa_id.id,
        institution_name: apiData.lembaga_desa_id.nama_lembaga,
        institution_code: apiData.lembaga_desa_id.kode_lembaga,
        status: apiData.lembaga_desa_id.status
      },
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
      {
        id: apiData.jabatan_id.id,
        employment_name: apiData.jabatan_id.nama_jabatan,
        employment_code: apiData.jabatan_id.kode_jabatan,
        employment_duties: apiData.jabatan_id.tupoksi_jabatan,
        faction: apiData.jabatan_id.golongan
      },
      asset(apiData.foto)
    ) as ReturnType<T, IncomingApiData, InstitutionMember>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(institutionMember: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(institutionMember)) return institutionMember.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(institutionMember._method ? { _method: institutionMember._method } : {}),
      lembaga_desa_id: institutionMember.village_institution,
      jabatan_id: institutionMember.employment,
      master_penduduk_id: institutionMember.resident,
      foto: institutionMember.foto
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.anggota_lembaga = InstitutionMember;
