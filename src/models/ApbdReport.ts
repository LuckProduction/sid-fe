import asset from '@/utils/asset';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_laporan: string;
  tahun: string;
  dokumen: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  nama_laporan: string;
  tahun: string;
  dokumen: string;
}

interface FormValue {
  _method?: 'PUT';
  report_name: string;
  year: string;
  document: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class ApbdReport extends Model {
  constructor(
    public id: number,
    public report_name: string,
    public year: string,
    public document: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, ApbdReport> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, ApbdReport>;
    return new ApbdReport(apiData.id, apiData.nama_laporan, apiData.tahun, asset(apiData.dokumen)) as ReturnType<T, IncomingApiData, ApbdReport>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(apbdReport: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(apbdReport)) return apbdReport.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(apbdReport._method ? { _method: apbdReport._method } : {}),
      nama_laporan: apbdReport.report_name,
      tahun: apbdReport.year,
      dokumen: apbdReport.document
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.laporan_apbd = ApbdReport;
