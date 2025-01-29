import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  judul: string;
  slug: string;
  no_penetapan: string;
  tgl_penetapan: string;
  jenis: string;
  tahun: string;
  dokumen: string;
  status: string;
  jumlah_download: number;
  dilihat: number;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  judul: string;
  jenis: string;
  no_penetapan: string;
  tahun: string;
  dokumen: string;
  status: string;
  tgl_penetapan: string;
  jumlah_download?: number;
  dilihat?: number;
}

interface FormValue {
  _method?: 'PUT';
  title: string;
  type: string;
  assignment_number: string;
  year: string;
  document: string;
  status: string;
  assignment_date: string;
  downloads?: number;
  seen?: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class LegalProducts extends Model {
  constructor(
    public id: number,
    public title: string,
    public assignment_number: string,
    public assignment_date: string,
    public type: string,
    public year: string,
    public document: string,
    public status: string,
    public downloads: number,
    public seen: number
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, LegalProducts> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, LegalProducts>;
    return new LegalProducts(apiData.id, apiData.judul, apiData.no_penetapan, apiData.tgl_penetapan, apiData.jenis, apiData.tahun, asset(apiData.dokumen), apiData.status, apiData.jumlah_download, apiData.dilihat) as ReturnType<
      T,
      IncomingApiData,
      LegalProducts
    >;
  }

  public static toApiData<T extends FormValue | FormValue[]>(legalProducts: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(legalProducts)) return legalProducts.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(legalProducts._method ? { _method: legalProducts._method } : {}),
      judul: legalProducts.title,
      jenis: legalProducts.type,
      no_penetapan: legalProducts.assignment_number,
      tahun: legalProducts.year,
      dokumen: legalProducts.document,
      status: legalProducts.status,
      tgl_penetapan: legalProducts.assignment_date,
      ...(legalProducts.downloads ? { downloads: legalProducts.downloads } : {}),
      ...(legalProducts.seen ? { seen: legalProducts.seen } : {})
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.produk_hukum = LegalProducts;
