import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_lembaga: string;
  kode_lembaga: string;
  status: string;
  deskripsi: string;
  logo: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama_lembaga: string;
  kode_lembaga: string;
  status: string;
  deskripsi: string;
  logo: string;
}

interface FormValue {
  _method?: 'PUT';
  institution_name: string;
  institution_code: string;
  status: string;
  desc: string;
  image: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VillageInstitution extends Model {
  constructor(
    public id: number,
    public institution_name: string,
    public institution_code: string,
    public status: string,
    public desc: string,
    public image: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VillageInstitution> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VillageInstitution>;
    return new VillageInstitution(apiData.id, apiData.nama_lembaga, apiData.kode_lembaga, apiData.status, apiData.deskripsi, asset(apiData.logo)) as ReturnType<T, IncomingApiData, VillageInstitution>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(villageInstitution: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(villageInstitution)) return villageInstitution.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(villageInstitution._method ? { _method: villageInstitution._method } : {}),
      nama_lembaga: villageInstitution.institution_name,
      kode_lembaga: villageInstitution.institution_code,
      status: villageInstitution.status,
      deskripsi: villageInstitution.desc,
      logo: villageInstitution.image
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.lembaga_desa = VillageInstitution;
