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

type FormValue = Pick<LetterAttribute, 'name'>;

type ReturnType<S, From, To> = S extends From[] ? To[] : To;
type Column = DatatableColumn<LetterAttribute>;
type FormField = FormFieldType<FormValue>;
type DescriptionsType = Override<DescriptionsItemType, { key: keyof Omit<LetterAttribute, 'descriptions'> }>;

export default class LetterAttribute extends Model {
  constructor(public id: number, public name: string) {
    super();
  }

  public static columns: Record<keyof Omit<LetterAttribute, 'descriptions'>, (column?: Partial<Column>) => Column> = {
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

  public descriptions: Record<keyof Omit<LetterAttribute, 'descriptions'>, (item?: Partial<DescriptionsType>) => DescriptionsType> = {
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

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, LetterAttribute> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, LetterAttribute>;
    return new LetterAttribute(apiData.id, apiData.name) as ReturnType<T, IncomingApiData, LetterAttribute>;
  }

  public static toApiData<T extends LetterAttribute | LetterAttribute[]>(letterAttribute: T): ReturnType<T, LetterAttribute, OutgoingApiData> {
    if (Array.isArray(letterAttribute)) return letterAttribute.map((object) => this.toApiData(object)) as ReturnType<T, LetterAttribute, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      name: letterAttribute.name
    };

    return apiData as ReturnType<T, LetterAttribute, OutgoingApiData>;
  }
}

// FIXME: you maybe want to change below line. If you don't want to then delete this FIXME line
Model.children.letter_attribute = LetterAttribute;
