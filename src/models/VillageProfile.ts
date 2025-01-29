import asset from '@/utils/asset';
import Model from './Model';

interface Kecamatan {
  id: number;
  nama_kecamatan: string;
  nama_camat: string;
  kode_kecamatan: string;
}

interface Kabupaten {
  id: number;
  nama_kabupaten: string;
  nama_bupati: string;
  kode_kabupaten: string;
}

interface District {
  id: number;
  district_name: string;
  districthead_name: string;
  district_code: string;
}

interface Regency {
  id: number;
  regency_name: string;
  regencyhead_name: string;
  regency_code: string;
}

interface IncomingApiData {
  id: number;
  nama_desa: string;
  kode_desa: string;
  kode_pos_desa: string;
  alamat_kantor: string;
  email_desa: string;
  logo_desa: string;
  profil_kecamatan: Kecamatan;
  profil_kabupaten: Kabupaten;
}

interface OutgoingApiData {
  _method?: 'PUT';
  nama_desa?: string;
  kode_desa?: string;
  kode_pos_desa?: string;
  alamat_kantor?: string;
  email_desa?: string;
  logo_desa?: string
  id_kecamatan?: number;
  nama_kecamatan?: string;
  kode_kecamatan?: string;
  nama_camat?: string;
  id_kabupaten?: number;
  nama_kabupaten?: string;
  kode_kabupaten?: string;
  nama_bupati?: string;
}

interface FormValue {
  _method: 'PUT';
  village_name: string;
  village_code: string;
  postal_code: string;
  office_adress: string;
  village_email: string;
  village_logo: string;
  district_id: number;
  district_name: string;
  district_code: string;
  districthead_name: string;
  regency_id: number;
  regency_name: string;
  regency_code: string;
  regencyhead_name: string;
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
    public village_logo: string,
    public district_id: number,
    public district_code: string,
    public district_name: string,
    public districthead_name: string,
    public regency_id: number,
    public regency_name: string,
    public regency_code: string,
    public regencyhead_name: string
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
      asset(apiData.logo_desa),
      apiData.profil_kecamatan.id,
      apiData.profil_kecamatan.kode_kecamatan,
      apiData.profil_kecamatan.nama_camat,
      apiData.profil_kecamatan.nama_camat,
      apiData.profil_kabupaten.id,
      apiData.profil_kabupaten.nama_kabupaten,
      apiData.profil_kabupaten.kode_kabupaten,
      apiData.profil_kabupaten.nama_bupati
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
      ...(formValue.district_id ? { id_kecamatan: formValue.district_id } : {}),
      ...(formValue.district_name ? { nama_kecamatan: formValue.district_name } : {}),
      ...(formValue.district_code ? { kode_kecamatan: formValue.district_code } : {}),
      ...(formValue.districthead_name ? { nama_camat: formValue.districthead_name } : {}),
      ...(formValue.regency_id ? { id_kabupaten: formValue.regency_id } : {}),
      ...(formValue.regency_name ? { nama_kabupaten: formValue.regency_name } : {}),
      ...(formValue.regency_code ? { kode_kabupaten: formValue.regency_code } : {}),
      ...(formValue.regencyhead_name ? { nama_bupati: formValue.regencyhead_name } : {}),
      ...(formValue.village_logo ? { logo_desa: formValue.village_logo } : {})
    };
    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.profil_desa = VillageProfile;
