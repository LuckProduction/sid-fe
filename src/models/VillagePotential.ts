import Model from './Model';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  nama_potensi: string;
  deskripsi: string;
  lokasi: string;
  slug: string;
  kategori: {
    id: number;
    nama_kategori: string;
  };
  foto: string;
  titik_koordinat: string;
  dilihat: number;
  created_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama_potensi: string;
  deskripsi: string;
  lokasi: string;
  kategori_id: number;
  foto: string;
  titik_koordinat: string;
}

interface FormValue {
  _method: 'PUT';
  potential_name: string;
  description: string;
  location: string;
  category: number;
  foto: string;
  coordinate: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VillagePotential extends Model {
  constructor(
    public id: number,
    public potential_name: string,
    public description: string,
    public location: string,
    public slug: string,
    public category: {
      id: number;
      category_name: string;
    },
    public foto: string,
    public coordinate: string,
    public seen: number,
    public created_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VillagePotential> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VillagePotential>;
    return new VillagePotential(
      apiData.id,
      apiData.nama_potensi,
      apiData.deskripsi,
      apiData.lokasi,
      apiData.slug,
      {
        id: apiData.kategori.id,
        category_name: apiData.kategori.nama_kategori
      },
      asset(apiData.foto),
      apiData.titik_koordinat,
      apiData.dilihat,
      apiData.created_at
    ) as ReturnType<T, IncomingApiData, VillagePotential>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(villagePotential: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(villagePotential)) return villagePotential.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    if (!villagePotential.category) {
      throw new Error('Kategori tidak boleh kosong');
    }
    const apiData: OutgoingApiData = {
      ...(villagePotential._method ? { _method: villagePotential._method } : {}),
      nama_potensi: villagePotential.potential_name,
      deskripsi: villagePotential.description,
      lokasi: villagePotential.location,
      kategori_id: villagePotential.category,
      foto: villagePotential.foto,
      titik_koordinat: villagePotential.coordinate
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.potensi_desa = VillagePotential;
