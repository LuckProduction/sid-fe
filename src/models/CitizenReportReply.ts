import Model from './Model';
import { IncomingApiData as IncomingResident } from './Resident';
import { IncomingApiData as IncomingCitizenReport } from './CitizenReport';
import asset from '@/utils/asset';

export interface IncomingApiData {
  id: number;
  master_penduduk_id: IncomingResident;
  layanan_pengaduan_id: {
    id: number;
    judul_pengaduan: string;
    deskripsi: string;
    dokumen: string;
    master_penduduk_id: number;
    status: string;
    suka: number;
    has_like: boolean;
  };
  konten: string;
  dokumen: string;
  tipe_balasan: string;
  suka: number;
  has_like: boolean;
  status: string;
  created_at: string;
}

export interface OutgoingApiData {
  _method?: 'PUT';
  layanan_pengaduan_id: number;
  konten: string;
  dokumen: string;
}

interface FormValue {
  _method?: 'PUT';
  citizen_report: number;
  content: string;
  doc: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class CitizenReportReply extends Model {
  constructor(
    public id: number,
    public resident: {
      id: number;
      nik: number;
      full_name: string;
    },
    public citizen_report: {
      id: number;
      report_title: string;
      desc: string;
      doc: string;
      resident: number;
      status: string;
      liked: number;
      has_like: boolean;
    },
    public content: string,
    public doc: string,
    public reply_type: string,
    public liked: number,
    public has_like: boolean,
    public status: string,
    public created_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, CitizenReportReply> {
    if (Array.isArray(apiData)) return (apiData as IncomingApiData[]).map((object) => CitizenReportReply.fromApiData(object)) as ReturnType<T, IncomingApiData, CitizenReportReply>;
    return new CitizenReportReply(
      apiData.id,
      {
        id: apiData.master_penduduk_id.id,
        nik: apiData.master_penduduk_id.nik,
        full_name: apiData.master_penduduk_id.nama_lengkap
      },
      {
        id: apiData.layanan_pengaduan_id.id,
        report_title: apiData.layanan_pengaduan_id.judul_pengaduan,
        desc: apiData.layanan_pengaduan_id.deskripsi,
        doc: apiData.layanan_pengaduan_id.dokumen !== null ? asset(apiData.layanan_pengaduan_id.dokumen) : apiData.layanan_pengaduan_id.dokumen,
        resident: apiData.layanan_pengaduan_id.master_penduduk_id,
        status: apiData.layanan_pengaduan_id.status,
        liked: apiData.layanan_pengaduan_id.suka,
        has_like: apiData.layanan_pengaduan_id.has_like
      },
      apiData.konten,
      apiData.dokumen !== null ? asset(apiData.dokumen) : apiData.dokumen,
      apiData.tipe_balasan,
      apiData.suka,
      apiData.has_like,
      apiData.status,
      apiData.created_at
    ) as ReturnType<T, IncomingApiData, CitizenReportReply>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(citizenReportReply: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(citizenReportReply)) return citizenReportReply.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(citizenReportReply._method ? { _method: citizenReportReply._method } : {}),
      layanan_pengaduan_id: citizenReportReply.citizen_report,
      konten: citizenReportReply.content,
      dokumen: citizenReportReply.doc
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.balasan_pengaduan = CitizenReportReply;
