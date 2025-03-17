import Model from './Model';

export interface IncomingApiData {
  id: number;
  jenis_surat_id: number;
  konten: string;
}

export interface OutgoingApiData {
  jenis_surat_id: number;
  konten: string;
}

interface FormValue {
  letter_type_id: number;
  content: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class LetterTemplate extends Model {
  constructor(
    public id: number,
    public letter_type_id: number,
    public content: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, LetterTemplate> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, LetterTemplate>;
    return new LetterTemplate(apiData.id, apiData.jenis_surat_id, apiData.konten) as ReturnType<T, IncomingApiData, LetterTemplate>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(letterTemplate: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(letterTemplate)) return letterTemplate.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      jenis_surat_id: letterTemplate.letter_type_id,
      konten: letterTemplate.content
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.template_surat = LetterTemplate;
