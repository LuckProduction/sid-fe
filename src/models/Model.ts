type ModelKeys = 'profil_desa' | 'user' | 'article' | 'category';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    profil_desa: undefined,
    user: undefined,
    article: undefined,
    category: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
