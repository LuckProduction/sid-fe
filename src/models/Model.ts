type ModelKeys = 'profil_desa' | 'user' | 'artikel' | 'kategori' | 'jabatan' | 'perangkat_desa';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    profil_desa: undefined,
    user: undefined,
    artikel: undefined,
    kategori: undefined,
    perangkat_desa: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
