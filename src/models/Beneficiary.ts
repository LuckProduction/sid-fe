import Model from './Model';
import { IncomingApiData as IncomingVillageInstitution } from './VillageInstitution';
import { IncomingApiData as IncomingResident } from './Resident';
import { IncomingApiData as IncomingPublicAssistance } from './PublicAssistance';
export interface IncomingApiData {
  id: number;
  peserta_id: IncomingVillageInstitution | IncomingResident;
  bantuan_id: IncomingPublicAssistance;
  tipe: string;
}

export interface OutgoingApiData {
  bantuan_id: number;
  peserta_id: number;
}

interface FormValue {
  public_assistance: number;
  beneficiary: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Beneficiary extends Model {
  constructor(
    public id: number,
    public beneficiary:
      | {
          id: number;
          institution_name: string;
          institution_code: string;
          status: string;
        }
      | {
          id: number;
          nik: number;
          full_name: string;
          family_relation: string;
          resident_status: 'aktif' | 'meninggal' | 'pindah' | 'masuk';
          marital_status: 'menikah' | 'belum menikah';
          kk_number: number;
          gender: string;
          religion: string;
        }
      | null,
    public public_assistance: {
      id: number;
      public_assistance_name: string;
      program_target: 'penduduk' | 'kartu keluarga' | 'lembaga';
      description: string;
      source_funding: 'pusat' | 'provinsi' | 'kabupaten' | 'kota' | 'dana desa' | 'lain-lain';
      status: 'aktif' | 'nonaktif';
    }
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Beneficiary> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Beneficiary>;
    return new Beneficiary(
      apiData.id,
      apiData.peserta_id
        ? 'nama_lengkap' in apiData.peserta_id
          ? {
              id: apiData.peserta_id.id,
              nik: apiData.peserta_id.nik,
              full_name: apiData.peserta_id.nama_lengkap,
              family_relation: apiData.peserta_id.hubungan_keluarga,
              resident_status: apiData.peserta_id.status_penduduk,
              marital_status: apiData.peserta_id.status_perkawinan,
              kk_number: apiData.peserta_id.nomor_kk,
              gender: apiData.peserta_id.jenis_kelamin,
              religion: apiData.peserta_id.agama
            }
          : {
              id: apiData.peserta_id.id,
              institution_name: apiData.peserta_id.nama_lembaga,
              institution_code: apiData.peserta_id.kode_lembaga,
              status: apiData.peserta_id.status
            }
        : null,
      {
        id: apiData.bantuan_id.id,
        public_assistance_name: apiData.bantuan_id.nama_bantuan,
        program_target: apiData.bantuan_id.sasaran_program,
        description: apiData.bantuan_id.keterangan,
        source_funding: apiData.bantuan_id.asal_dana,
        status: apiData.bantuan_id.status
      }
    ) as ReturnType<T, IncomingApiData, Beneficiary>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(beneficiary: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(beneficiary)) return beneficiary.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      bantuan_id: beneficiary.public_assistance,
      peserta_id: beneficiary.beneficiary
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.anggota_bantuan = Beneficiary;
