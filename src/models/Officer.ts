import Model from './Model';

export interface IncomingApiData {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
    permissions: string[];
  };
  permissions: string[];
}

export interface OutgoingApiData {
  _method?: 'PUT';
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
}

interface FormValue {
  _method?: 'PUT';
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Officer extends Model {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public role: {
      id: number;
      name: string;
      permission: string[];
    },
    public permissions: string[]
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Officer> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Officer>;
    return new Officer(
      apiData.id,
      apiData.name,
      apiData.email,
      {
        id: apiData.role.id,
        name: apiData.role.name,
        permission: apiData.role.permissions
      },
      apiData.permissions
    ) as ReturnType<T, IncomingApiData, Officer>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(officer: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(officer)) return officer.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      ...(officer._method ? { _method: officer._method } : {}),
      name: officer.name,
      email: officer.email,
      password: officer.password,
      role: officer.role,
      permissions: officer.permissions
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.pengguna = Officer;
