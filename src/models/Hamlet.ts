import Model from './Model';

export interface IncomingApiData {
  id: number;
  profil_desa: {
    nama_desa: string;
    kode_desa: number;
  };
  nama_dusun: string;
  nama_kepala_dusun: string;
  nik_kepala_dusun: number;
  file_batas_dusun: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama_dusun: string;
  nama_kepala_dusun: string;
  nik_kepala_dusun: number;
  file_batas_dusun: string;
}

interface FormValue {
  _method?: 'PUT';
  hamlet_name: string;
  head_hamlet_name: string;
  head_hamlet_nik: number;
  administrative_area: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Hamlet extends Model {
  constructor(
    public id: number,
    public village_profile: {
      village_name: string;
      village_code: number;
    },
    public hamlet_name: string,
    public head_hamlet_name: string,
    public head_hamlet_nik: number,
    public administrative_area: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Hamlet> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Hamlet>;
    return new Hamlet(
      apiData.id,
      {
        village_name: apiData.profil_desa.nama_desa,
        village_code: apiData.profil_desa.kode_desa
      },
      apiData.nama_dusun,
      apiData.nama_kepala_dusun,
      apiData.nik_kepala_dusun,
      apiData.file_batas_dusun
    ) as ReturnType<T, IncomingApiData, Hamlet>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(hamlet: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(hamlet)) return hamlet.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(hamlet._method ? { _method: hamlet._method } : {}),
      nama_dusun: hamlet.hamlet_name,
      nama_kepala_dusun: hamlet.head_hamlet_name,
      nik_kepala_dusun: hamlet.head_hamlet_nik,
      file_batas_dusun: hamlet.administrative_area
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.dusun = Hamlet;
