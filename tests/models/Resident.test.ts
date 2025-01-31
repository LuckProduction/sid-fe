import Model from '@/models/Model';
import Resident, { IncomingApiData } from '@/models/Resident';
import { describe, expect, it } from 'vitest';

describe('Resident', () => {
  it('should be a valid model', () => {
    expect(Resident).toBeDefined();
    expect(Resident.prototype).toBeDefined();
    expect(Resident.prototype.constructor).toBeDefined();
    expect(Resident.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.resident).toBe(Resident);
  });

  it('should be able to create a new Resident', () => {
    const resident = new Resident(1, 'Malik');

    expect(resident).toBeDefined();
    expect(resident.id).toBe(1);
    expect(resident.name).toBe('Malik');
  });

  it('should be able to create a new Resident from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const resident = Resident.fromApiData(apiData);

    expect(resident).toBeDefined();
    expect(resident.id).toBe(apiData.id);
    expect(resident.name).toBe(apiData.name);
  });

  it('should be able to create a new Resident array from API data array', () => {
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
    const residents = Resident.fromApiData(apiData);

    expect(residents).toBeDefined();
    expect(residents.length).toBe(apiData.length);
    expect(residents[0].id).toBe(apiData[0].id);
    expect(residents[0].name).toBe(apiData[0].name);
    expect(residents[1].id).toBe(apiData[1].id);
    expect(residents[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Resident to API data', () => {
    const resident = new Resident(1, 'Malik');
    const apiData = Resident.toApiData(resident);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(resident.id);
    expect(apiData.name).toBe(resident.name);
  });

  it('should be able to convert Resident array to API data array', () => {
    const residents = [new Resident(1, 'Malik'), new Resident(2, 'Fauzan')];
    const apiData = Resident.toApiData(residents);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(residents.length);
    expect(apiData[0].id).toBe(residents[0].id);
    expect(apiData[0].name).toBe(residents[0].name);
    expect(apiData[1].id).toBe(residents[1].id);
    expect(apiData[1].name).toBe(residents[1].name);
  });
});
