import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_pengaturan: string;
  slug: string;
  tipe: string;
  deskripsi: string;
  nilai: string;
  bisa_diedit: number;
}

export interface OutgoingApiData {
  id: number;
  nilai: string;
}

interface FormValue {
  id: number;
  value: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class WebSettings extends Model {
  constructor(
    public id: number,
    public setting_name: string,
    public slug: string,
    public type: string,
    public desc: string,
    public value: string,
    public editable: number
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, WebSettings> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, WebSettings>;
    return new WebSettings(apiData.id, apiData.nama_pengaturan, apiData.slug, apiData.tipe, apiData.deskripsi, apiData.nilai, apiData.bisa_diedit) as ReturnType<T, IncomingApiData, WebSettings>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(data: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(data)) {
      return data.map((item) => ({
        id: item.id,
        nilai: item.value
      })) as ReturnType<T, FormValue, OutgoingApiData>;
    }

    return {
      id: data.id,
      nilai: data.value
    } as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
