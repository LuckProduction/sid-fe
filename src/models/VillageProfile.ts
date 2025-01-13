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
  nama_desa: string;
  kode_desa: string;
  kode_pos: string;
  alamat_kantor: string;
  email_desa: string;
  id_kecamatan: number;
  id_kabupaten: number;
}

interface FormValue {
  village_name: string;
  village_code: string;
  postal_code: string;
  office_adress: string;
  village_email: string;
  district_id: number;
  regency_id: number;
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
      apiData.logo_desa,
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
      nama_desa: formValue.village_name,
      kode_desa: formValue.village_code,
      kode_pos: formValue.postal_code,
      alamat_kantor: formValue.office_adress,
      email_desa: formValue.village_email,
      id_kecamatan: formValue.district_id,
      id_kabupaten: formValue.regency_id
    };
    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.profil_desa = VillageProfile;
