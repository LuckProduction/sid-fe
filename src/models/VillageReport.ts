import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_laporan: string;
  tipe: 'ubah' | 'masuk' | 'keluar' | 'lahir' | 'meninggal';
  status: string;
  atribut_master_laporan_id: {
    id: 3;
    nama_atribut: string;
    tipe: string;
    label: string;
    placeholder: string;
  }[];
}

export interface OutgoingApiData {
  nama_laporan: string;
  tipe: string;
  status: string;
}

interface FormValue {
  report_name: string;
  type: string;
  status: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class VillageReport extends Model {
  constructor(
    public id: number,
    public report_name: string,
    public type: string,
    public status: string,
    public report_attribute: {
      id: number;
      attribute: string;
      type: string;
      label: string;
      placeholder: string;
    }[]
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, VillageReport> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, VillageReport>;
    return new VillageReport(
      apiData.id,
      apiData.nama_laporan,
      apiData.tipe,
      apiData.status,
      apiData.atribut_master_laporan_id.map((item) => ({
        id: item.id,
        attribute: item.nama_atribut,
        type: item.tipe,
        label: item.label,
        placeholder: item.placeholder
      }))
    ) as ReturnType<T, IncomingApiData, VillageReport>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(villageReport: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(villageReport)) return villageReport.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama_laporan: villageReport.report_name,
      tipe: villageReport.type,
      status: villageReport.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.master_laporan = VillageReport;
