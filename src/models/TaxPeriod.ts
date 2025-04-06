import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_pajak: string;
  tahun: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  status: 'aktif' | 'nonaktif';
}

export interface OutgoingApiData {
  nama_pajak: string;
  tahun: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  status: 'aktif' | 'nonaktif';
}

interface FormValue {
  tax_name: string;
  year: string;
  date_start: string;
  date_end: string;
  status: 'aktif' | 'nonaktif';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class TaxPeriod extends Model {
  constructor(
    public id: number,
    public tax_name: string,
    public year: string,
    public date_start: string,
    public date_end: string,
    public status: 'aktif' | 'nonaktif'
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, TaxPeriod> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, TaxPeriod>;
    return new TaxPeriod(apiData.id, apiData.nama_pajak, apiData.tahun, apiData.tanggal_mulai, apiData.tanggal_akhir, apiData.status) as ReturnType<T, IncomingApiData, TaxPeriod>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(taxPeriod: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(taxPeriod)) return taxPeriod.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama_pajak: taxPeriod.tax_name,
      tahun: taxPeriod.year,
      tanggal_mulai: taxPeriod.date_start,
      tanggal_akhir: taxPeriod.date_end,
      status: taxPeriod.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.periode_pajak = TaxPeriod;
