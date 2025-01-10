type ModelKeys =
  | 'antarwaktu'
  | 'artikel'
  | 'berita_acara'
  | 'enumerator_indikator'
  | 'enumerator'
  | 'hasil_spasial'
  | 'indikator'
  | 'kabupaten'
  | 'olahan_kabupaten'
  | 'olahan_spasial'
  | 'opd_kabupaten'
  | 'opd_provinsi'
  | 'periode'
  | 'permission'
  | 'provinsi'
  | 'rekap_hasil'
  | 'sektor_spasial'
  | 'sektor'
  | 'subjek_indikator'
  | 'subjek'
  | 'user_opd_kabupaten'
  | 'user_opd_provinsi'
  | 'user'
  | 'variabel';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    antarwaktu: undefined,
    artikel: undefined,
    berita_acara: undefined,
    enumerator_indikator: undefined,
    enumerator: undefined,
    hasil_spasial: undefined,
    indikator: undefined,
    kabupaten: undefined,
    olahan_kabupaten: undefined,
    olahan_spasial: undefined,
    opd_kabupaten: undefined,
    opd_provinsi: undefined,
    periode: undefined,
    permission: undefined,
    provinsi: undefined,
    rekap_hasil: undefined,
    sektor_spasial: undefined,
    sektor: undefined,
    subjek_indikator: undefined,
    subjek: undefined,
    user_opd_kabupaten: undefined,
    user_opd_provinsi: undefined,
    user: undefined,
    variabel: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
