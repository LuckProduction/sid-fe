import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama: string;
  tipe: 'area' | 'titik';
  kategori: {
    id: 2;
    nama_kategori: string;
    tipe: string;
  };
  deskripsi: string;
  konten: string;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama: string;
  tipe: string;
  konten: string;
  kategori_id: number;
  deskripsi: string;
}

interface FormValue {
  _method?: 'PUT';
  map_name: string;
  type: string;
  content: string;
  category_id: number;
  desc: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Map extends Model {
  constructor(
    public id: number,
    public map_name: string,
    public type: 'area' | 'titik',
    public category: {
      id: number;
      category_name: string;
      type: string;
    },
    public desc: string,
    public content: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Map> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Map>;
    return new Map(
      apiData.id,
      apiData.nama,
      apiData.tipe,
      {
        id: apiData.kategori.id,
        category_name: apiData.kategori.nama_kategori,
        type: apiData.kategori.tipe
      },
      apiData.deskripsi,
      apiData.tipe === 'area' ? asset(apiData.konten) : apiData.konten,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, Map>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(map: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(map)) return map.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(map._method ? { _method: map._method } : {}),
      nama: map.map_name,
      tipe: map.type,
      kategori_id: map.category_id,
      konten: map.content,
      deskripsi: map.desc
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.pemetaan = Map;
