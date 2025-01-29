import Model from '@/models/Model';
import VillageInstitution, { IncomingApiData } from '@/models/VillageInstitution';
import { describe, expect, it } from 'vitest';

describe('VillageInstitution', () => {
  it('should be a valid model', () => {
    expect(VillageInstitution).toBeDefined();
    expect(VillageInstitution.prototype).toBeDefined();
    expect(VillageInstitution.prototype.constructor).toBeDefined();
    expect(VillageInstitution.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.village_institution).toBe(VillageInstitution);
  });

  it('should be able to create a new Village Institution', () => {
    const villageInstitution = new VillageInstitution(1, 'Malik');

    expect(villageInstitution).toBeDefined();
    expect(villageInstitution.id).toBe(1);
    expect(villageInstitution.name).toBe('Malik');
  });

  it('should be able to create a new Village Institution from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const villageInstitution = VillageInstitution.fromApiData(apiData);

    expect(villageInstitution).toBeDefined();
    expect(villageInstitution.id).toBe(apiData.id);
    expect(villageInstitution.name).toBe(apiData.name);
  });

  it('should be able to create a new Village Institution array from API data array', () => {
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
    const villageInstitutions = VillageInstitution.fromApiData(apiData);

    expect(villageInstitutions).toBeDefined();
    expect(villageInstitutions.length).toBe(apiData.length);
    expect(villageInstitutions[0].id).toBe(apiData[0].id);
    expect(villageInstitutions[0].name).toBe(apiData[0].name);
    expect(villageInstitutions[1].id).toBe(apiData[1].id);
    expect(villageInstitutions[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Village Institution to API data', () => {
    const villageInstitution = new VillageInstitution(1, 'Malik');
    const apiData = VillageInstitution.toApiData(villageInstitution);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(villageInstitution.id);
    expect(apiData.name).toBe(villageInstitution.name);
  });

  it('should be able to convert Village Institution array to API data array', () => {
    const villageInstitutions = [new VillageInstitution(1, 'Malik'), new VillageInstitution(2, 'Fauzan')];
    const apiData = VillageInstitution.toApiData(villageInstitutions);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(villageInstitutions.length);
    expect(apiData[0].id).toBe(villageInstitutions[0].id);
    expect(apiData[0].name).toBe(villageInstitutions[0].name);
    expect(apiData[1].id).toBe(villageInstitutions[1].id);
    expect(apiData[1].name).toBe(villageInstitutions[1].name);
  });
});
