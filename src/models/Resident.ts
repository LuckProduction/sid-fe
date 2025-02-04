import Model from './Model';

export interface IncomingApiData {
  id: number;
  nik: number;
  nama_lengkap: string;
  hubungan_keluarga: string;
  status_penduduk: 'tetap' | 'tidak tetap';
  status_perkawinan: 'menikah' | 'belum menikah';
  nomor_kk: number;
  jenis_kelamin: string;
  agama: string;
  alamat_pendidikan?: {
    alamat_kk: string;
    dusun_id: number;
    rt: number;
    rw: number;
    alamat_sebelumnya: string;
    nomor_telepon: number;
    email: string;
  };
  kelahiran?: {
    tanggal_lahir: string;
    tempat_lahir: string;
    no_akta_kelahiran: number;
  };
  orang_tua?: {
    nama_ayah: string;
    nama_ibu: string;
    nik_ayah: number;
    nik_ibu: number;
  };
  pekerjaan_pendidikan?: {
    pendidikan_kk: string;
    pekerjaan: string;
    pendidikan_sedang_ditempuh: string;
  };
}

export interface OutgoingApiData {
  nik: number;
  nama_lengkap: string;
  hubungan_keluarga: string;
  status_penduduk: 'tetap' | 'tidak tetap';
  status_perkawinan: 'menikah' | 'belum menikah';
  nomor_kk: number;
  jenis_kelamin: string;
  agama: string;
  alamat?: {
    alamat_kk: string;
    dusun_id: number;
    rt: number;
    rw: number;
    alamat_sebelumnya: string;
    nomor_telepon: number;
    email: string;
  };
  kelahiran?: {
    tanggal_lahir: string;
    tempat_lahir: string;
    no_akta_kelahiran: number;
  };
  orang_tua?: {
    nama_ayah: string;
    nama_ibu: string;
    nik_ayah: number;
    nik_ibu: number;
  };
  pekerjaan_pendidikan?: {
    pendidikan_kk: string;
    pekerjaan: string;
    pendidikan_sedang_ditempuh: string;
  };
  file?: string;
}

interface FormValue {
  nik: number;
  full_name: string;
  family_relation: string;
  resident_status: 'tetap' | 'tidak tetap';
  marital_status: 'menikah' | 'belum menikah';
  kk_number: number;
  gender: string;
  religion: string;
  address?: {
    address_kk: string;
    hamlet_id: number;
    rt: number;
    rw: number;
    last_address: string;
    telp: number;
    email: string;
  };
  birth?: {
    birth_date: string;
    birth_place: string;
    akta_kelahiran_number: number;
  };
  parents?: {
    father_name: string;
    mother_name: string;
    father_nik: number;
    mother_nik: number;
  };
  education_career?: {
    education_kk: string;
    career: string;
    education_in_progress: string;
  };
  file?: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Resident extends Model {
  constructor(
    public id: number,
    public nik: number,
    public full_name: string,
    public family_relation: string,
    public resident_status: 'tetap' | 'tidak tetap',
    public marital_status: 'menikah' | 'belum menikah',
    public kk_number: number,
    public gender: string,
    public religion: string,
    public address?: {
      address_kk: string;
      hamlet_id: number;
      rt: number;
      rw: number;
      last_address: string;
      telp: number;
      email: string;
    },
    public birth?: {
      birth_date: string;
      birth_place: string;
      akta_kelahiran_number: number;
    },
    public parents?: {
      father_name: string;
      mother_name: string;
      father_nik: number;
      mother_nik: number;
    },
    public education_career?: {
      education_kk: string;
      career: string;
      education_in_progress: string;
    }
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Resident> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Resident>;
    return new Resident(
      apiData.id,
      apiData.nik,
      apiData.nama_lengkap,
      apiData.hubungan_keluarga,
      apiData.status_penduduk,
      apiData.status_perkawinan,
      apiData.nomor_kk,
      apiData.jenis_kelamin,
      apiData.agama,
      apiData.alamat_pendidikan
        ? {
            address_kk: apiData.alamat_pendidikan.alamat_kk,
            hamlet_id: apiData.alamat_pendidikan.dusun_id,
            rt: apiData.alamat_pendidikan.rt,
            rw: apiData.alamat_pendidikan.rw,
            last_address: apiData.alamat_pendidikan.alamat_sebelumnya,
            telp: apiData.alamat_pendidikan.nomor_telepon,
            email: apiData.alamat_pendidikan.email
          }
        : undefined,
      apiData.kelahiran
        ? {
            birth_date: apiData.kelahiran.tanggal_lahir,
            birth_place: apiData.kelahiran.tempat_lahir,
            akta_kelahiran_number: apiData.kelahiran.no_akta_kelahiran
          }
        : undefined,
      apiData.orang_tua
        ? {
            father_name: apiData.orang_tua.nama_ayah,
            mother_name: apiData.orang_tua.nama_ibu,
            father_nik: apiData.orang_tua.nik_ayah,
            mother_nik: apiData.orang_tua.nik_ibu
          }
        : undefined,
      apiData.pekerjaan_pendidikan
        ? {
            education_kk: apiData.pekerjaan_pendidikan.pendidikan_kk,
            career: apiData.pekerjaan_pendidikan.pekerjaan,
            education_in_progress: apiData.pekerjaan_pendidikan.pendidikan_sedang_ditempuh
          }
        : undefined
    ) as ReturnType<T, IncomingApiData, Resident>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(resident: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(resident)) return resident.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nik: resident.nik,
      nama_lengkap: resident.full_name,
      hubungan_keluarga: resident.family_relation,
      status_penduduk: resident.resident_status,
      status_perkawinan: resident.marital_status,
      nomor_kk: resident.kk_number,
      jenis_kelamin: resident.gender,
      agama: resident.religion,
      alamat: resident.address
        ? {
            alamat_kk: resident.address.address_kk,
            dusun_id: resident.address.hamlet_id,
            rt: resident.address.rt,
            rw: resident.address.rw,
            alamat_sebelumnya: resident.address.last_address,
            nomor_telepon: resident.address.telp,
            email: resident.address.email
          }
        : undefined,
      kelahiran: resident.birth
        ? {
            tanggal_lahir: resident.birth.birth_date,
            tempat_lahir: resident.birth.birth_place,
            no_akta_kelahiran: resident.birth.akta_kelahiran_number
          }
        : undefined,
      orang_tua: resident.parents
        ? {
            nama_ayah: resident.parents.father_name,
            nama_ibu: resident.parents.mother_name,
            nik_ayah: resident.parents.father_nik,
            nik_ibu: resident.parents.mother_nik
          }
        : undefined,
      pekerjaan_pendidikan: resident.education_career
        ? {
            pendidikan_kk: resident.education_career.education_kk,
            pekerjaan: resident.education_career.career,
            pendidikan_sedang_ditempuh: resident.education_career.education_in_progress
          }
        : undefined,
      ...(resident.file ? { _method: resident.file } : {})
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.master_penduduk = Resident;
