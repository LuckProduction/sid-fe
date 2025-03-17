import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_jabatan: string;
  kode_jabatan: string;
  golongan: string;
  tupoksi_jabatan: string;
}

export interface OutgoingApiData {
  nama_jabatan: string;
  kode_jabatan: string;
  golongan: string;
  tupoksi_jabatan: string;
}

interface FormValue {
  employment_name: string;
  employment_code: string;
  faction: string;
  employment_duties: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Employment extends Model {
  constructor(
    public id: number,
    public employment_name: string,
    public employment_code: string,
    public faction: string,
    public employment_duties: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Employment> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Employment>;
    return new Employment(apiData.id, apiData.nama_jabatan, apiData.kode_jabatan, apiData.golongan, apiData.tupoksi_jabatan) as ReturnType<T, IncomingApiData, Employment>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(employment: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(employment)) return employment.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama_jabatan: employment.employment_name,
      kode_jabatan: employment.employment_code,
      tupoksi_jabatan: employment.employment_duties,
      golongan: employment.faction
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.jabatan = Employment;
