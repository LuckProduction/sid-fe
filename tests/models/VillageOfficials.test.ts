import Model from '@/models/Model';
import VillageOfficials, { IncomingApiData } from '@/models/VillageOfficials';
import { describe, expect, it } from 'vitest';

describe('VillageOfficials', () => {
  it('should be a valid model', () => {
    expect(VillageOfficials).toBeDefined();
    expect(VillageOfficials.prototype).toBeDefined();
    expect(VillageOfficials.prototype.constructor).toBeDefined();
    expect(VillageOfficials.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.village_officials).toBe(VillageOfficials);
  });

  it('should be able to create a new Village Officials', () => {
    const villageOfficials = new VillageOfficials(1, 'Malik');

    expect(villageOfficials).toBeDefined();
    expect(villageOfficials.id).toBe(1);
    expect(villageOfficials.name).toBe('Malik');
  });

  it('should be able to create a new Village Officials from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const villageOfficials = VillageOfficials.fromApiData(apiData);

    expect(villageOfficials).toBeDefined();
    expect(villageOfficials.id).toBe(apiData.id);
    expect(villageOfficials.name).toBe(apiData.name);
  });

  it('should be able to create a new Village Officials array from API data array', () => {
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
    const villageOfficialses = VillageOfficials.fromApiData(apiData);

    expect(villageOfficialses).toBeDefined();
    expect(villageOfficialses.length).toBe(apiData.length);
    expect(villageOfficialses[0].id).toBe(apiData[0].id);
    expect(villageOfficialses[0].name).toBe(apiData[0].name);
    expect(villageOfficialses[1].id).toBe(apiData[1].id);
    expect(villageOfficialses[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Village Officials to API data', () => {
    const villageOfficials = new VillageOfficials(1, 'Malik');
    const apiData = VillageOfficials.toApiData(villageOfficials);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(villageOfficials.id);
    expect(apiData.name).toBe(villageOfficials.name);
  });

  it('should be able to convert Village Officials array to API data array', () => {
    const villageOfficialses = [new VillageOfficials(1, 'Malik'), new VillageOfficials(2, 'Fauzan')];
    const apiData = VillageOfficials.toApiData(villageOfficialses);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(villageOfficialses.length);
    expect(apiData[0].id).toBe(villageOfficialses[0].id);
    expect(apiData[0].name).toBe(villageOfficialses[0].name);
    expect(apiData[1].id).toBe(villageOfficialses[1].id);
    expect(apiData[1].name).toBe(villageOfficialses[1].name);
  });
});
