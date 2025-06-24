import Model from './Model';

export interface IncomingApiData {
  id: number;
  kata_kunci: string;
  balasan: string;
}

interface FormValue {
  keyword: string;
  reply: string;
}

export interface OutgoingApiData {
  kata_kunci: string;
  balasan: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class AutomaticReply extends Model {
  constructor(
    public id: number,
    public keyword: string,
    public reply: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, AutomaticReply> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, AutomaticReply>;
    return new AutomaticReply(apiData.id, apiData.kata_kunci, apiData.balasan) as ReturnType<T, IncomingApiData, AutomaticReply>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(automaticReply: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(automaticReply)) return automaticReply.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      kata_kunci: automaticReply.keyword,
      balasan: automaticReply.reply
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.balasan_otomatis = AutomaticReply;
