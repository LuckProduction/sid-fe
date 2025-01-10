import Model from '@/models/Model';
import User, { IncomingApiData } from '@/models/User';
import { describe, expect, it } from 'vitest';

describe('User', () => {
  it('should be a valid model', () => {
    expect(User).toBeDefined();
    expect(User.prototype).toBeDefined();
    expect(User.prototype.constructor).toBeDefined();
    expect(User.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.user).toBe(User);
  });

  it('should be able to create a new User', () => {
    const user = new User(1, 'Malik');

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.name).toBe('Malik');
  });

  it('should be able to create a new User from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const user = User.fromApiData(apiData);

    expect(user).toBeDefined();
    expect(user.id).toBe(apiData.id);
    expect(user.name).toBe(apiData.name);
  });

  it('should be able to create a new User array from API data array', () => {
    const apiData: IncomingApiData[] = [
      {
        id: 1,
        name: 'Rapik'
      },
      {
        id: 2,
        name: 'Aqshal'
      }
    ];
    const users = User.fromApiData(apiData);

    expect(users).toBeDefined();
    expect(users.length).toBe(apiData.length);
    expect(users[0].id).toBe(apiData[0].id);
    expect(users[0].name).toBe(apiData[0].name);
    expect(users[1].id).toBe(apiData[1].id);
    expect(users[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert User to API data', () => {
    const user = new User(1, 'Malik');
    const apiData = User.toApiData(user);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(user.id);
    expect(apiData.name).toBe(user.name);
  });

  it('should be able to convert User array to API data array', () => {
    const users = [new User(1, 'Malik'), new User(2, 'Fauzan')];
    const apiData = User.toApiData(users);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(users.length);
    expect(apiData[0].id).toBe(users[0].id);
    expect(apiData[0].name).toBe(users[0].name);
    expect(apiData[1].id).toBe(users[1].id);
    expect(apiData[1].name).toBe(users[1].name);
  });
});
