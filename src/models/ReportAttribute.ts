import Model from './Model';

export interface IncomingApiData {
  id: number;
  master_laporan_id: {
    id: 3;
    nama_laporan: string;
    tipe: string;
    status: string;
  };
  nama_atribut: string;
  tipe: string;
  label: string;
  harus_diisi: 'ya' | 'tidak';
  placeholder: string;
}

export interface OutgoingApiData {
  master_laporan_id: number;
  nama_atribut: string;
  placeholder: string;
  tipe: string;
  label: string;
  harus_diisi: 'ya' | 'tidak';
}

interface FormValue {
  village_report: number;
  attribute_name: string;
  placeholder: string;
  type: string;
  label: string;
  required: 'ya' | 'tidak';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class ReportAttribute extends Model {
  constructor(
    public id: number,
    public village_report: {
      id: number;
      report_name: string;
      type: string;
      status: string;
    },
    public attribute_name: string,
    public type: string,
    public label: string,
    public required: 'ya' | 'tidak',
    public placeholder: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, ReportAttribute> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, ReportAttribute>;
    return new ReportAttribute(
      apiData.id,
      {
        id: apiData.master_laporan_id.id,
        report_name: apiData.master_laporan_id.nama_laporan,
        type: apiData.master_laporan_id.tipe,
        status: apiData.master_laporan_id.status
      },
      apiData.nama_atribut,
      apiData.tipe,
      apiData.label,
      apiData.harus_diisi,
      apiData.placeholder
    ) as ReturnType<T, IncomingApiData, ReportAttribute>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(reportAttribute: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(reportAttribute)) return reportAttribute.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama_atribut: reportAttribute.attribute_name,
      master_laporan_id: reportAttribute.village_report,
      tipe: reportAttribute.type,
      label: reportAttribute.label,
      placeholder: reportAttribute.placeholder,
      harus_diisi: reportAttribute.required
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.atribut_master_laporan = ReportAttribute;
