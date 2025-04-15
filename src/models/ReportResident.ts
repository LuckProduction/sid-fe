import { DatatableColumn, FormField as FormFieldType, Override } from '@/types';
import strings from '@/utils/strings';
import { DescriptionsItemType } from 'antd/es/descriptions';
import Model from './Model';
import { InputType } from '@/constants';

export interface IncomingApiData {
  // id: 4,
  // token: string,
  // master_laporan_id: {
  //   id: 3,
  //   nama_laporan: Lapor Penduduk Masuk,
  //   tipe: masuk,
  //   status: aktif,
  //   created_at: 2025-04-05T01:43:34.000000Z,
  //   updated_at: 2025-04-05T01:43:34.000000Z
  // },
  // master_penduduk_id: {
  //   id: 434,
  //   nama_lengkap: Maxi Rajamuda,
  //   nik: 7571042303840002,
  //   hubungan_keluarga: Kepala Keluarga,
  //   nomor_kk: 7503071007190001,
  //   jenis_kelamin: L,
  //   agama: Islam,
  //   foto: null,
  //   status_perkawinan: cerai,
  //   status_penduduk: tetap,
  //   created_at: 2025-03-18T14:07:19.000000Z,
  //   updated_at: 2025-03-18T14:07:19.000000Z
  // },
  // tipe_pelapor: diri sendiri,
  // atribut_laporan_penduduk: [
  //   {
  //     id: 5,
  //     nama_atribut: NIK,
  //     atribut_master_laporan_id: 4,
  //     konten: 1231313331
  //   }
  // ],
  // status: proses,
  // created_at: 06 April 2025,
  // updated_at: 06 April 2025
}

export interface OutgoingApiData {
  name: string;
}

type FormValue = Pick<ReportResident, 'name'>;

type ReturnType<S, From, To> = S extends From[] ? To[] : To;
type Column = DatatableColumn<ReportResident>;
type FormField = FormFieldType<FormValue>;
type DescriptionsType = Override<DescriptionsItemType, { key: keyof Omit<ReportResident, 'descriptions'> }>;

export default class ReportResident extends Model {
  constructor(
    public id: number,
    public name: string
  ) {
    super();
  }

  public static columns: Record<keyof Omit<ReportResident, 'descriptions'>, (column?: Partial<Column>) => Column> = {
    id: (column) => ({
      title: strings('id'),
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      ...column
    }),
    name: (column) => ({
      title: strings('name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchable: true,
      ...column
    })
  };

  private static _formFields: Record<keyof FormValue, (field?: Partial<FormField>) => FormField> = {
    name: (field) => ({
      label: strings('name'),
      name: 'name',
      type: InputType.TEXT,
      rules: [{ required: true, message: strings('s_is_required', strings('name')) }],
      ...field
    })
  };

  public static formFields(): FormField[] {
    return [this._formFields.name()];
  }

  public descriptions: Record<keyof Omit<ReportResident, 'descriptions'>, (item?: Partial<DescriptionsType>) => DescriptionsType> = {
    id: (item) => ({
      key: 'id',
      label: strings('id'),
      children: this.id,
      ...item
    }),
    name: (item) => ({
      key: 'name',
      label: strings('name'),
      children: this.name,
      ...item
    })
  };

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, ReportResident> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, ReportResident>;
    return new ReportResident(apiData.id, apiData.name) as ReturnType<T, IncomingApiData, ReportResident>;
  }

  public static toApiData<T extends ReportResident | ReportResident[]>(reportResident: T): ReturnType<T, ReportResident, OutgoingApiData> {
    if (Array.isArray(reportResident)) return reportResident.map((object) => this.toApiData(object)) as ReturnType<T, ReportResident, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: reportResident.name
    };

    return apiData as ReturnType<T, ReportResident, OutgoingApiData>;
  }
}

Model.children.lapor_penduduk = ReportResident;
