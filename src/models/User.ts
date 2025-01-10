import { Action, Role } from '@/constants';
import asset from '@/utils/asset';
import Permission from './Permission';
import Model, { ModelChildren } from './Model';

export interface IncomingApiData {
  id: number;
  username: string;
  nama_lengkap?: string;
  email: string;
  opd?: {
    id: number;
    nama: string;
    tingkat: 'opd_kabupaten' | 'opd_provinsi';
    lokasi: string;
    logo: string;
  };
  role: {
    id: number;
    name: string;
    permissions: string[];
  };
  permissions: string[];
}

interface OutgoingApiData {
  username: IncomingApiData['username'];
  email: IncomingApiData['email'];
}

export default class User extends Model {
  constructor(
    public id: number,
    public name: string,
    public username: string,
    public email: string,
    public token: string,
    public role: Role,
    public permissions: Permission[] = [],
    public agency?: {
      id: number;
      name: string;
      level: 'opd_kabupaten' | 'opd_provinsi';
      location: string;
      logo: string;
    }
  ) {
    super();
  }

  is(role: Role) {
    return this.role === role;
  }

  eitherIs(...roles: Role[]) {
    return roles.some((role) => this.is(role));
  }

  can(action: Action, model: ModelChildren) {
    return this.permissions.some((permission) => permission.can(action, model));
  }

  cant(action: Action, model: ModelChildren) {
    return !this.can(action, model);
  }

  eitherCan(...permissions: [Action, ModelChildren][]) {
    return permissions.some(([action, model]) => this.can(action, model));
  }

  cantDoAny(...permissions: [Action, ModelChildren][]) {
    return !this.eitherCan(...permissions);
  }

  static fromApiData(apiData: IncomingApiData, token: string): User {
    const roles = {
      admin: Role.ADMIN,
      opd_provinsi: Role.PROVINCE_AGENCY,
      opd_kabupaten: Role.REGENCY_AGENCY
    };
    const role = roles[apiData.role.name as keyof typeof roles] || Role.ENUMERATOR;
    const permissions = Permission.fromApiData([...apiData.role.permissions, ...apiData.permissions]);
    let agency = undefined;
    if (apiData.opd) {
      agency = {
        id: apiData.opd.id,
        name: apiData.opd.nama,
        level: apiData.opd.tingkat,
        location: apiData.opd.lokasi,
        logo: asset(apiData.opd.logo)
      };
    }
    return new User(apiData.id, apiData.nama_lengkap || apiData.username, apiData.username, apiData.email, token, role, permissions, agency);
  }

  static toApiData(user: User): OutgoingApiData {
    return {
      username: user.username,
      email: user.email
    };
  }
}

Model.children.user = User;
