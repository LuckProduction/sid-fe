import Model from '@/models/Model';
import VillageProfil, { IncomingApiData } from '@/models/VillageProfil';
import { describe, expect, it } from 'vitest';

describe('VillageProfil', () => {
  it('should be a valid model', () => {
    expect(VillageProfil).toBeDefined();
    expect(VillageProfil.prototype).toBeDefined();
    expect(VillageProfil.prototype.constructor).toBeDefined();
    expect(VillageProfil.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.village_profil).toBe(VillageProfil);
  });

  it('should be able to create a new Village Profil', () => {
    const villageProfil = new VillageProfil(1, 'Malik');

    expect(villageProfil).toBeDefined();
    expect(villageProfil.id).toBe(1);
    expect(villageProfil.name).toBe('Malik');
  });

  it('should be able to create a new Village Profil from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const villageProfil = VillageProfil.fromApiData(apiData);

    expect(villageProfil).toBeDefined();
    expect(villageProfil.id).toBe(apiData.id);
    expect(villageProfil.name).toBe(apiData.name);
  });

  it('should be able to create a new Village Profil array from API data array', () => {
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
    const villageProfils = VillageProfil.fromApiData(apiData);

    expect(villageProfils).toBeDefined();
    expect(villageProfils.length).toBe(apiData.length);
    expect(villageProfils[0].id).toBe(apiData[0].id);
    expect(villageProfils[0].name).toBe(apiData[0].name);
    expect(villageProfils[1].id).toBe(apiData[1].id);
    expect(villageProfils[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Village Profil to API data', () => {
    const villageProfil = new VillageProfil(1, 'Malik');
    const apiData = VillageProfil.toApiData(villageProfil);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(villageProfil.id);
    expect(apiData.name).toBe(villageProfil.name);
  });

  it('should be able to convert Village Profil array to API data array', () => {
    const villageProfils = [new VillageProfil(1, 'Malik'), new VillageProfil(2, 'Fauzan')];
    const apiData = VillageProfil.toApiData(villageProfils);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(villageProfils.length);
    expect(apiData[0].id).toBe(villageProfils[0].id);
    expect(apiData[0].name).toBe(villageProfils[0].name);
    expect(apiData[1].id).toBe(villageProfils[1].id);
    expect(apiData[1].name).toBe(villageProfils[1].name);
  });
});
