type ModelKeys = 'profil_desa' | 'user';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    profil_desa: undefined,
    user: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
