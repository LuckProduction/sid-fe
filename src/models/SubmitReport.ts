import Model from './Model';
import { IncomingApiData as IncomingResident } from './Resident';

export interface IncomingApiData {
  id: number;
  token: string;
  master_laporan_id: {
    id: number;
    nama_laporan: string;
    tipe: string;
    status: string;
  };
  master_penduduk_id: IncomingResident | null;
  tipe_pelapor: string;
  atribut_laporan_penduduk: {
    id: number;
    nama_atribut: string;
    atribut_master_laporan_id: number;
    konten: string;
  }[];
  status: string;
  create_at: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class SubmitReport extends Model {
  constructor(
    public id: number,
    public token: string,
    public village_report: {
      id: number;
      report_name: string;
      type: string;
      status: string;
    },
    public resident: {
      id: number;
      nik: number;
      full_name: string;
      family_relation: string;
      resident_status: 'aktif' | 'meninggal' | 'pindah' | 'masuk';
      marital_status: 'menikah' | 'belum menikah';
      kk_number: number;
      gender: string;
      religion: string;
    } | null,
    public reporter_type: string,
    public report_attribute: {
      id: number;
      attribute_name: string;
      village_report_attribute: number;
      content: string;
    }[],
    public status: string,
    public created_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, SubmitReport> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, SubmitReport>;
    return new SubmitReport(
      apiData.id,
      apiData.token,
      {
        id: apiData.master_laporan_id.id,
        report_name: apiData.master_laporan_id.nama_laporan,
        status: apiData.master_laporan_id.status,
        type: apiData.master_laporan_id.tipe
      },
      apiData.master_penduduk_id
        ? {
            id: apiData.master_penduduk_id.id,
            nik: apiData.master_penduduk_id.nik,
            full_name: apiData.master_penduduk_id.nama_lengkap,
            family_relation: apiData.master_penduduk_id.hubungan_keluarga,
            resident_status: apiData.master_penduduk_id.status_penduduk,
            marital_status: apiData.master_penduduk_id.status_perkawinan,
            kk_number: apiData.master_penduduk_id.nomor_kk,
            gender: apiData.master_penduduk_id.jenis_kelamin,
            religion: apiData.master_penduduk_id.agama
          }
        : null,
      apiData.tipe_pelapor,
      apiData.atribut_laporan_penduduk.map((item) => ({
        id: item.id,
        attribute_name: item.nama_atribut,
        village_report_attribute: item.atribut_master_laporan_id,
        content: item.konten
      })),
      apiData.status,
      apiData.create_at
    ) as ReturnType<T, IncomingApiData, SubmitReport>;
  }
}

Model.children.lapor_penduduk = SubmitReport;
