import Model from '@/models/Model';
import VillagePotential, { IncomingApiData } from '@/models/VillagePotential';
import { describe, expect, it } from 'vitest';

describe('VillagePotential', () => {
  it('should be a valid model', () => {
    expect(VillagePotential).toBeDefined();
    expect(VillagePotential.prototype).toBeDefined();
    expect(VillagePotential.prototype.constructor).toBeDefined();
    expect(VillagePotential.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.village_potential).toBe(VillagePotential);
  });

  it('should be able to create a new Village Potential', () => {
    const villagePotential = new VillagePotential(1, 'Malik');

    expect(villagePotential).toBeDefined();
    expect(villagePotential.id).toBe(1);
    expect(villagePotential.name).toBe('Malik');
  });

  it('should be able to create a new Village Potential from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const villagePotential = VillagePotential.fromApiData(apiData);

    expect(villagePotential).toBeDefined();
    expect(villagePotential.id).toBe(apiData.id);
    expect(villagePotential.name).toBe(apiData.name);
  });

  it('should be able to create a new Village Potential array from API data array', () => {
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
    const villagePotentials = VillagePotential.fromApiData(apiData);

    expect(villagePotentials).toBeDefined();
    expect(villagePotentials.length).toBe(apiData.length);
    expect(villagePotentials[0].id).toBe(apiData[0].id);
    expect(villagePotentials[0].name).toBe(apiData[0].name);
    expect(villagePotentials[1].id).toBe(apiData[1].id);
    expect(villagePotentials[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Village Potential to API data', () => {
    const villagePotential = new VillagePotential(1, 'Malik');
    const apiData = VillagePotential.toApiData(villagePotential);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(villagePotential.id);
    expect(apiData.name).toBe(villagePotential.name);
  });

  it('should be able to convert Village Potential array to API data array', () => {
    const villagePotentials = [new VillagePotential(1, 'Malik'), new VillagePotential(2, 'Fauzan')];
    const apiData = VillagePotential.toApiData(villagePotentials);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(villagePotentials.length);
    expect(apiData[0].id).toBe(villagePotentials[0].id);
    expect(apiData[0].name).toBe(villagePotentials[0].name);
    expect(apiData[1].id).toBe(villagePotentials[1].id);
    expect(apiData[1].name).toBe(villagePotentials[1].name);
  });
});
