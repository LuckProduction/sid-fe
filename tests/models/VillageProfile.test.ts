import Model from '@/models/Model';
import VillageProfile, { IncomingApiData } from '@/models/VillageProfile';
import { describe, expect, it } from 'vitest';

describe('VillageProfile', () => {
  it('should be a valid model', () => {
    expect(VillageProfile).toBeDefined();
    expect(VillageProfile.prototype).toBeDefined();
    expect(VillageProfile.prototype.constructor).toBeDefined();
    expect(VillageProfile.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.village_profile).toBe(VillageProfile);
  });

  it('should be able to create a new Village Profile', () => {
    const villageProfile = new VillageProfile(1, 'Malik');

    expect(villageProfile).toBeDefined();
    expect(villageProfile.id).toBe(1);
    expect(villageProfile.name).toBe('Malik');
  });

  it('should be able to create a new Village Profile from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const villageProfile = VillageProfile.fromApiData(apiData);

    expect(villageProfile).toBeDefined();
    expect(villageProfile.id).toBe(apiData.id);
    expect(villageProfile.name).toBe(apiData.name);
  });

  it('should be able to create a new Village Profile array from API data array', () => {
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
    const villageProfiles = VillageProfile.fromApiData(apiData);

    expect(villageProfiles).toBeDefined();
    expect(villageProfiles.length).toBe(apiData.length);
    expect(villageProfiles[0].id).toBe(apiData[0].id);
    expect(villageProfiles[0].name).toBe(apiData[0].name);
    expect(villageProfiles[1].id).toBe(apiData[1].id);
    expect(villageProfiles[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Village Profile to API data', () => {
    const villageProfile = new VillageProfile(1, 'Malik');
    const apiData = VillageProfile.toApiData(villageProfile);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(villageProfile.id);
    expect(apiData.name).toBe(villageProfile.name);
  });

  it('should be able to convert Village Profile array to API data array', () => {
    const villageProfiles = [new VillageProfile(1, 'Malik'), new VillageProfile(2, 'Fauzan')];
    const apiData = VillageProfile.toApiData(villageProfiles);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(villageProfiles.length);
    expect(apiData[0].id).toBe(villageProfiles[0].id);
    expect(apiData[0].name).toBe(villageProfiles[0].name);
    expect(apiData[1].id).toBe(villageProfiles[1].id);
    expect(apiData[1].name).toBe(villageProfiles[1].name);
  });
});
