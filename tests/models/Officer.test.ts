import Model from '@/models/Model';
import Officer, { IncomingApiData } from '@/models/Officer';
import { describe, expect, it } from 'vitest';

describe('Officer', () => {
  it('should be a valid model', () => {
    expect(Officer).toBeDefined();
    expect(Officer.prototype).toBeDefined();
    expect(Officer.prototype.constructor).toBeDefined();
    expect(Officer.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.officer).toBe(Officer);
  });

  it('should be able to create a new Officer', () => {
    const officer = new Officer(1, 'Malik');

    expect(officer).toBeDefined();
    expect(officer.id).toBe(1);
    expect(officer.name).toBe('Malik');
  });

  it('should be able to create a new Officer from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const officer = Officer.fromApiData(apiData);

    expect(officer).toBeDefined();
    expect(officer.id).toBe(apiData.id);
    expect(officer.name).toBe(apiData.name);
  });

  it('should be able to create a new Officer array from API data array', () => {
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
    const officers = Officer.fromApiData(apiData);

    expect(officers).toBeDefined();
    expect(officers.length).toBe(apiData.length);
    expect(officers[0].id).toBe(apiData[0].id);
    expect(officers[0].name).toBe(apiData[0].name);
    expect(officers[1].id).toBe(apiData[1].id);
    expect(officers[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Officer to API data', () => {
    const officer = new Officer(1, 'Malik');
    const apiData = Officer.toApiData(officer);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(officer.id);
    expect(apiData.name).toBe(officer.name);
  });

  it('should be able to convert Officer array to API data array', () => {
    const officers = [new Officer(1, 'Malik'), new Officer(2, 'Fauzan')];
    const apiData = Officer.toApiData(officers);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(officers.length);
    expect(apiData[0].id).toBe(officers[0].id);
    expect(apiData[0].name).toBe(officers[0].name);
    expect(apiData[1].id).toBe(officers[1].id);
    expect(apiData[1].name).toBe(officers[1].name);
  });
});
