import Model from './Model';
import { IncomingApiData as IncomingResident } from './Resident';
import { IncomingApiData as IncomingTaxPeriod } from './TaxPeriod';

export interface IncomingApiData {
  id: 1;
  master_penduduk_id: IncomingResident;
  periode_pajak_id: IncomingTaxPeriod;
  status: 'lunas' | 'belum bayar';
}

export interface OutgoingApiData {
  master_penduduk_id: number;
  periode_pajak_id: number;
  status: 'lunas' | 'belum bayar';
}

interface FormValue {
  resident: number;
  tax_period: number;
  status: 'lunas' | 'belum bayar';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class PublicTax extends Model {
  constructor(
    public id: number,
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
    },
    public tax_period: {
      id: number;
      tax_name: string;
      year: string;
      date_start: string;
      date_end: string;
      status: 'aktif' | 'nonaktif';
    },
    public status: 'lunas' | 'belum bayar'
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, PublicTax> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, PublicTax>;
    return new PublicTax(
      apiData.id,
      {
        id: apiData.master_penduduk_id.id,
        nik: apiData.master_penduduk_id.nik,
        full_name: apiData.master_penduduk_id.nama_lengkap,
        family_relation: apiData.master_penduduk_id.hubungan_keluarga,
        resident_status: apiData.master_penduduk_id.status_penduduk,
        marital_status: apiData.master_penduduk_id.status_perkawinan,
        kk_number: apiData.master_penduduk_id.nomor_kk,
        gender: apiData.master_penduduk_id.jenis_kelamin,
        religion: apiData.master_penduduk_id.agama
      },
      {
        id: apiData.periode_pajak_id.id,
        tax_name: apiData.periode_pajak_id.nama_pajak,
        year: apiData.periode_pajak_id.tahun,
        date_start: apiData.periode_pajak_id.tanggal_mulai,
        date_end: apiData.periode_pajak_id.tanggal_akhir,
        status: apiData.periode_pajak_id.status
      },
      apiData.status
    ) as ReturnType<T, IncomingApiData, PublicTax>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(publicTax: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(publicTax)) return publicTax.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      master_penduduk_id: publicTax.resident,
      periode_pajak_id: publicTax.tax_period,
      status: publicTax.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.wajib_pajak = PublicTax;
