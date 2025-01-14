import Model from './Model';

export interface IncomingApiData {
  id: number;
  judul: string;
  konten: string;
  kategori: {
    id: number;
    nama_kategori: string;
  }[];
  gambar: string;
  tag: string;
}

export interface OutgoingApiData {
  judul: string;
  konten: string;
  kategori: string;
  gambar: string;
  tag: string;
}

interface FormValue {
  title: string;
  content: string;
  category?: number[];
  image: string;
  tag: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Article extends Model {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public category: {
      id: number;
      category_name: string;
    }[] = [],
    public image: string,
    public tag: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Article> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Article>;
    return new Article(
      apiData.id,
      apiData.judul,
      apiData.konten,
      apiData.kategori.map((item) => ({
        id: item.id,
        category_name: item.nama_kategori
      })),
      apiData.gambar,
      apiData.tag
    ) as ReturnType<T, IncomingApiData, Article>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(article: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(article)) return article.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    if (!article.category) {
      throw new Error('Kategori tidak boleh kosong');
    }
    const apiData: OutgoingApiData = {
      judul: article.title,
      konten: article.content,
      kategori: article.category.join(','),
      gambar: article.image,
      tag: article.tag
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.article = Article;
