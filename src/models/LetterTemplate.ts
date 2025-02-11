import { DatatableColumn, FormField as FormFieldType, Override } from '@/types';
import strings from '@/utils/strings';
import { DescriptionsItemType } from 'antd/es/descriptions';
import Model from './Model';
import { InputType } from '@/constants';

export interface IncomingApiData {
  id: number;
  name: string;
}

export interface OutgoingApiData {
  name: string;
}

type FormValue = Pick<LetterTemplate, 'name'>;

type ReturnType<S, From, To> = S extends From[] ? To[] : To;
type Column = DatatableColumn<LetterTemplate>;
type FormField = FormFieldType<FormValue>;
type DescriptionsType = Override<DescriptionsItemType, { key: keyof Omit<LetterTemplate, 'descriptions'> }>;

export default class LetterTemplate extends Model {
  constructor(public id: number, public name: string) {
    super();
  }

  public static columns: Record<keyof Omit<LetterTemplate, 'descriptions'>, (column?: Partial<Column>) => Column> = {
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
  }

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
    return [
      this._formFields.name()
    ];
  }

  public descriptions: Record<keyof Omit<LetterTemplate, 'descriptions'>, (item?: Partial<DescriptionsType>) => DescriptionsType> = {
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

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, LetterTemplate> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, LetterTemplate>;
    return new LetterTemplate(apiData.id, apiData.name) as ReturnType<T, IncomingApiData, LetterTemplate>;
  }

  public static toApiData<T extends LetterTemplate | LetterTemplate[]>(letterTemplate: T): ReturnType<T, LetterTemplate, OutgoingApiData> {
    if (Array.isArray(letterTemplate)) return letterTemplate.map((object) => this.toApiData(object)) as ReturnType<T, LetterTemplate, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: letterTemplate.name
    };

    return apiData as ReturnType<T, LetterTemplate, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.letter_template = LetterTemplate;
