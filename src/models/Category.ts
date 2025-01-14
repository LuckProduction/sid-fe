import Model from './Model';

export interface IncomingApiData {
  id: number;
  nama_kategori: string;
  tipe: string;
}

export interface OutgoingApiData {
  nama_kategori: string;
  tipe: string;
}

interface FormValue {
  category_name: string;
  type: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Category extends Model {
  constructor(
    public id: number,
    public category_name: string,
    public type: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Category> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Category>;
    return new Category(apiData.id, apiData.nama_kategori, apiData.tipe) as ReturnType<T, IncomingApiData, Category>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(category: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(category)) return category.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama_kategori: category.category_name,
      tipe: category.type
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.category = Category;
