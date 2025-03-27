import asset from '@/utils/asset';
import Model from './Model';
import { IncomingApiData as IncomingResident } from './Resident';

export interface IncomingApiData {
  id: number;
  judul_pengaduan: string;
  deskripsi: string;
  dokumen: string;
  master_penduduk_id: IncomingResident;
  balasan_pengaduan: {
    id: number;
    master_penduduk_id: IncomingResident;
    layanan_pengaduan_id: number;
    konten: string;
    dokumen: string;
    tipe_balasan: string;
    status_publikasi: string;
    created_at: string;
  }[];
  status: string;
  suka: number;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  judul_pengaduan: string;
  deskripsi: string;
  dokumen: string;
  nik: string;
  status: string;
}

interface FormValues {
  report_title: string;
  desc: string;
  doc: string;
  nik: string;
  status: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class CitizenReport extends Model {
  constructor(
    public id: number,
    public report_title: string,
    public desc: string,
    public doc: string,
    public resident: {
      id: number;
      full_name: string;
      foto: string;
    },
    public reply: {
      id: number;
      resident: {
        id: number;
        full_name: string;
        foto: string;
      };
      citizen_report_id: number;
      content: string;
      doc: string;
      reply_type: string;
      publication_status: string;
      created_at: string;
    }[],
    public status: string,
    public liked: number,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, CitizenReport> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, CitizenReport>;
    return new CitizenReport(
      apiData.id,
      apiData.judul_pengaduan,
      apiData.deskripsi,
      apiData.dokumen !== null ? asset(apiData.dokumen) : apiData.dokumen,
      {
        id: apiData.master_penduduk_id.id,
        full_name: apiData.master_penduduk_id.nama_lengkap,
        foto: asset(apiData.master_penduduk_id.foto)
      },
      apiData.balasan_pengaduan?.map((item) => ({
        id: item.id,
        resident: {
          id: item.master_penduduk_id.id,
          full_name: item.master_penduduk_id.nama_lengkap,
          foto: asset(item.master_penduduk_id.foto)
        },
        citizen_report_id: item.layanan_pengaduan_id,
        content: item.konten,
        doc: asset(item.dokumen),
        reply_type: item.tipe_balasan,
        publication_status: item.status_publikasi,
        created_at: item.created_at
      })),
      apiData.status,
      apiData.suka,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, CitizenReport>;
  }

  public static toApiData<T extends FormValues | FormValues[]>(citizenReport: T): ReturnType<T, FormValues, OutgoingApiData> {
    if (Array.isArray(citizenReport)) return citizenReport.map((object) => this.toApiData(object)) as ReturnType<T, FormValues, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      judul_pengaduan: citizenReport.report_title,
      deskripsi: citizenReport.desc,
      dokumen: citizenReport.doc,
      nik: citizenReport.nik,
      status: citizenReport.status
    };

    return apiData as ReturnType<T, FormValues, OutgoingApiData>;
  }
}

Model.children.pengaduan = CitizenReport;
