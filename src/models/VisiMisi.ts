import Model from './Model';

export interface IncomingApiData {
  id: number;
  konten: string;
  tipe: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  konten: string;
  tipe: string;
}

interface FormValue {
  _method: 'PUT';
  content: string;
  type: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VisiMisi extends Model {
  constructor(
    public id: number,
    public content: string,
    public type: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VisiMisi> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VisiMisi>;
    return new VisiMisi(apiData.id, apiData.konten, apiData.tipe) as ReturnType<T, IncomingApiData, VisiMisi>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(visiMisi: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(visiMisi)) return visiMisi.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(visiMisi._method ? { _method: visiMisi._method } : {}),

      konten: visiMisi.content,
      tipe: visiMisi.type
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.visi_misi = VisiMisi;
