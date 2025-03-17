import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  batas_utara: string;
  batas_selatan: string;
  batas_timur: string;
  batas_barat: string;
  luas_wilayah: string;
  file_batas_desa: string;
  titik_koordinat_kantor_desa: string;
}

export interface OutgoingApiData {
  batas_utara?: string;
  batas_selatan?: string;
  batas_timur?: string;
  batas_barat?: string;
  luas_wilayah?: string;
  file_batas_desa?: string;
  titik_koordinat_kantor_desa?: string;
}

interface formValue {
  north?: string;
  south?: string;
  east?: string;
  west?: string;
  area?: string;
  adiministrative_file?: string;
  headvillage_coordinate?: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VillageBoundaries extends Model {
  constructor(
    public id: number,
    public north: string,
    public south: string,
    public east: string,
    public west: string,
    public area: string,
    public administrative_file: string,
    public headvillage_coordinate: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VillageBoundaries> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VillageBoundaries>;
    return new VillageBoundaries(apiData.id, apiData.batas_utara, apiData.batas_selatan, apiData.batas_timur, apiData.batas_barat, apiData.luas_wilayah, asset(apiData.file_batas_desa), apiData.titik_koordinat_kantor_desa) as ReturnType<
      T,
      IncomingApiData,
      VillageBoundaries
    >;
  }

  public static toApiData<T extends formValue | formValue[]>(villageBoundaries: T): ReturnType<T, formValue, OutgoingApiData> {
    if (Array.isArray(villageBoundaries)) return villageBoundaries.map((object) => this.toApiData(object)) as ReturnType<T, formValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(villageBoundaries.north ? { batas_utara: villageBoundaries.north } : {}),
      ...(villageBoundaries.south ? { batas_selatan: villageBoundaries.south } : {}),
      ...(villageBoundaries.east ? { batas_timur: villageBoundaries.east } : {}),
      ...(villageBoundaries.west ? { batas_barat: villageBoundaries.west } : {}),
      ...(villageBoundaries.area ? { luas_wilayah: villageBoundaries.area } : {}),
      ...(villageBoundaries.adiministrative_file ? { file_batas_desa: villageBoundaries.adiministrative_file } : {}),
      ...(villageBoundaries.headvillage_coordinate ? { titik_koordinat_kantor_desa: villageBoundaries.headvillage_coordinate } : {})
    };

    return apiData as ReturnType<T, formValue, OutgoingApiData>;
  }
}
