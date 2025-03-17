import Model from './Model';
import { IncomingApiData as IncomingApbdReport } from './ApbdReport';

export interface IncomingApiData {
  id: number;
  laporan_apbd_id: IncomingApbdReport;
  nama_komponen: string;
  tipe: string;
  sumber_anggaran: string;
  jumlah_anggaran: number;
  total_saldo: number;
  bidang: string;
}

export interface OutgoingApiData {
  nama_komponen: string;
  laporan_apbd_id: number;
  tipe: string;
  sumber_anggaran: string;
  jumlah_anggaran: number;
  bidang: string;
}

interface FormValue {
  component_name: string;
  apbd_report: number;
  type: string;
  source_funding: string;
  budget_amount: number;
  field: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class ApbdItem extends Model {
  constructor(
    public id: number,
    public component_name: string,
    public apbd_report: {
      id: number;
      report_name: string;
      year: string;
      document: string;
    },
    public type: string,
    public source_funding: string,
    public budget_amount: number,
    public total_amount: number,
    public field: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, ApbdItem> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, ApbdItem>;
    return new ApbdItem(
      apiData.id,
      apiData.nama_komponen,
      {
        id: apiData.laporan_apbd_id.id,
        report_name: apiData.laporan_apbd_id.nama_laporan,
        document: apiData.laporan_apbd_id.dokumen,
        year: apiData.laporan_apbd_id.tahun
      },
      apiData.tipe,
      apiData.sumber_anggaran,
      apiData.jumlah_anggaran,
      apiData.total_saldo,
      apiData.bidang
    ) as ReturnType<T, IncomingApiData, ApbdItem>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(apbdItem: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(apbdItem)) return apbdItem.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama_komponen: apbdItem.component_name,
      laporan_apbd_id: apbdItem.apbd_report,
      jumlah_anggaran: apbdItem.budget_amount,
      sumber_anggaran: apbdItem.component_name,
      tipe: apbdItem.type,
      bidang: apbdItem.field
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.item_apbd = ApbdItem;
