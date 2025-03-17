import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_bantuan: string;
  sasaran_program: 'penduduk' | 'kartu keluarga' | 'lembaga';
  keterangan: string;
  asal_dana: 'pusat' | 'provinsi' | 'kabupaten' | 'kota' | 'dana desa' | 'lain-lain';
  status: 'aktif' | 'nonaktif';
}

export interface OutgoingApiData {
  nama_bantuan: string;
  sasaran_program: 'penduduk' | 'kartu keluarga' | 'lembaga';
  keterangan: string;
  asal_dana: 'pusat' | 'provinsi' | 'kabupaten' | 'kota' | 'dana desa' | 'lain-lain';
  status: 'aktif' | 'nonaktif';
}

interface FormValue {
  public_assistance_name: string;
  program_target: 'penduduk' | 'kartu keluarga' | 'lembaga';
  description: string;
  source_funding: 'pusat' | 'provinsi' | 'kabupaten' | 'kota' | 'dana desa' | 'lain-lain';
  status: 'aktif' | 'nonaktif';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class PublicAssistance extends Model {
  constructor(
    public id: number,
    public public_assistance_name: string,
    public program_target: 'penduduk' | 'kartu keluarga' | 'lembaga',
    public description: string,
    public source_funding: 'pusat' | 'provinsi' | 'kabupaten' | 'kota' | 'dana desa' | 'lain-lain',
    public status: 'aktif' | 'nonaktif'
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, PublicAssistance> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, PublicAssistance>;
    return new PublicAssistance(apiData.id, apiData.nama_bantuan, apiData.sasaran_program, apiData.keterangan, apiData.asal_dana, apiData.status) as ReturnType<T, IncomingApiData, PublicAssistance>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(publicAssistance: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(publicAssistance)) return publicAssistance.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama_bantuan: publicAssistance.public_assistance_name,
      sasaran_program: publicAssistance.program_target,
      asal_dana: publicAssistance.source_funding,
      status: publicAssistance.status,
      keterangan: publicAssistance.description
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.bantuan = PublicAssistance;
