import { Action } from '@/constants';
import Model, { ModelChildren } from './Model';

export interface IncomingApiData {
  id: number;
  email: string;
  name: string;
}

interface OutgoingApiData {
  email: IncomingApiData['email'];
}

export default class User extends Model {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public token: string
  ) {
    super();
  }

  static fromApiData(apiData: IncomingApiData, token: string): User {
    return new User(apiData.id, apiData.email, apiData.name, token);
  }

  static toApiData(user: User): OutgoingApiData {
    return {
      email: user.email
    };
  }
}

Model.children.user = User;
