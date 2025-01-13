import { Action } from '@/constants';
import Model, { ModelChildren } from './Model';

const something = {
  id: 1,
  name: 'admin',
  email: 'admin@app.id',
  email_verified_at: null,
  created_at: '2025-01-11T17:19:38.000000Z',
  updated_at: '2025-01-11T17:19:38.000000Z'
};
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
