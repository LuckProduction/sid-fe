import asset from '@/utils/asset';
import Model from './Model';

interface Kabupaten {
  id: number;
  nama_kabupaten: string;
  nama_bupati: string;
  kode_kabupaten: string;
}

interface Kecamatan {
  id: number;
  nama_kecamatan: string;
  nama_camat: string;
  kode_kecamatan: string;
  profil_kabupaten: Kabupaten;
}

interface IncomingApiData {
  id: number;
  nama_desa: string;
  kode_desa: string;
  kode_pos_desa: string;
  alamat_kantor: string;
  email_desa: string;
  embed_video_profil_desa: string;
  logo_desa: string;
  profil_kecamatan: Kecamatan;
}

interface OutgoingApiData {
  _method?: 'PUT';
  nama_desa?: string;
  kode_desa?: string;
  kode_pos_desa?: string;
  alamat_kantor?: string;
  email_desa?: string;
  embed_video_profil_desa?: string;
  logo_desa?: string;
  profil_kecamatan?: {
    nama_camat?: string;
    kode_kecamatan?: string;
    profil_kabupaten?: {
      nama_bupati?: string;
      kode_kabupaten?: string;
    };
  };
}

interface FormValue {
  _method?: 'PUT';
  village_name?: string;
  village_code?: string;
  postal_code?: string;
  office_adress?: string;
  village_email?: string;
  profile_video_link?: string;
  village_logo?: string;
  district_profile?: {
    districthead_name?: string;
    district_code?: string;
    regency_profile?: {
      regencyhead_name?: string;
      regency_code?: string;
    };
  };
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VillageProfile extends Model {
  constructor(
    public id: number,
    public village_name: string,
    public village_code: string,
    public postal_code: string,
    public office_address: string,
    public village_email: string,
    public profile_video_link: string,
    public village_logo: string,
    public district_profile?: {
      id_district: number;
      district_name: string;
      districthead_name: string;
      district_code: string;
      regency_profile?: {
        id_regency: number;
        regency_name: string;
        regencyhead_name: string;
        regency_code: string;
      };
    }
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VillageProfile> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VillageProfile>;

    return new VillageProfile(
      apiData.id,
      apiData.nama_desa,
      apiData.kode_desa,
      apiData.kode_pos_desa,
      apiData.alamat_kantor,
      apiData.email_desa,
      apiData.embed_video_profil_desa,
      asset(apiData.logo_desa),
      apiData.profil_kecamatan
        ? {
            id_district: apiData.profil_kecamatan.id,
            district_code: apiData.profil_kecamatan.kode_kecamatan,
            districthead_name: apiData.profil_kecamatan.nama_camat,
            district_name: apiData.profil_kecamatan.nama_kecamatan,
            regency_profile: {
              id_regency: apiData.profil_kecamatan.profil_kabupaten.id,
              regency_code: apiData.profil_kecamatan.profil_kabupaten.kode_kabupaten,
              regencyhead_name: apiData.profil_kecamatan.profil_kabupaten.nama_bupati,
              regency_name: apiData.profil_kecamatan.profil_kabupaten.nama_kabupaten
            }
          }
        : undefined
    ) as ReturnType<T, IncomingApiData, VillageProfile>;
  }

  static toApiData<T extends FormValue | FormValue[]>(formValue: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(formValue)) return formValue.map((object) => VillageProfile.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(formValue._method ? { _method: formValue._method } : {}),
      ...(formValue.village_name ? { nama_desa: formValue.village_name } : {}),
      ...(formValue.village_code ? { kode_desa: formValue.village_code } : {}),
      ...(formValue.postal_code ? { kode_pos_desa: formValue.postal_code } : {}),
      ...(formValue.office_adress ? { alamat_kantor: formValue.office_adress } : {}),
      ...(formValue.village_email ? { email_desa: formValue.village_email } : {}),
      ...(formValue.profile_video_link ? { embed_video_profil_desa: formValue.profile_video_link } : {}),
      profil_kecamatan: formValue.district_profile
        ? {
            kode_kecamatan: formValue.district_profile.district_code,
            nama_camat: formValue.district_profile.districthead_name,
            profil_kabupaten: formValue.district_profile.regency_profile
              ? {
                  kode_kabupaten: formValue.district_profile.regency_profile.regency_code,
                  nama_bupati: formValue.district_profile.regency_profile.regencyhead_name
                }
              : undefined
          }
        : undefined
    };
    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.profil_desa = VillageProfile;
