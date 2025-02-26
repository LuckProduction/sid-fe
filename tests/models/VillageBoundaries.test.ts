import Model from '@/models/Model';
import VillageBoundaries, { IncomingApiData } from '@/models/VillageBoundaries';
import { describe, expect, it } from 'vitest';

describe('VillageBoundaries', () => {
  it('should be a valid model', () => {
    expect(VillageBoundaries).toBeDefined();
    expect(VillageBoundaries.prototype).toBeDefined();
    expect(VillageBoundaries.prototype.constructor).toBeDefined();
    expect(VillageBoundaries.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.village_boundaries).toBe(VillageBoundaries);
  });

  it('should be able to create a new Village Boundaries', () => {
    const villageBoundaries = new VillageBoundaries(1, 'Malik');

    expect(villageBoundaries).toBeDefined();
    expect(villageBoundaries.id).toBe(1);
    expect(villageBoundaries.name).toBe('Malik');
  });

  it('should be able to create a new Village Boundaries from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const villageBoundaries = VillageBoundaries.fromApiData(apiData);

    expect(villageBoundaries).toBeDefined();
    expect(villageBoundaries.id).toBe(apiData.id);
    expect(villageBoundaries.name).toBe(apiData.name);
  });

  it('should be able to create a new Village Boundaries array from API data array', () => {
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
    const villageBoundarieses = VillageBoundaries.fromApiData(apiData);

    expect(villageBoundarieses).toBeDefined();
    expect(villageBoundarieses.length).toBe(apiData.length);
    expect(villageBoundarieses[0].id).toBe(apiData[0].id);
    expect(villageBoundarieses[0].name).toBe(apiData[0].name);
    expect(villageBoundarieses[1].id).toBe(apiData[1].id);
    expect(villageBoundarieses[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Village Boundaries to API data', () => {
    const villageBoundaries = new VillageBoundaries(1, 'Malik');
    const apiData = VillageBoundaries.toApiData(villageBoundaries);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(villageBoundaries.id);
    expect(apiData.name).toBe(villageBoundaries.name);
  });

  it('should be able to convert Village Boundaries array to API data array', () => {
    const villageBoundarieses = [new VillageBoundaries(1, 'Malik'), new VillageBoundaries(2, 'Fauzan')];
    const apiData = VillageBoundaries.toApiData(villageBoundarieses);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(villageBoundarieses.length);
    expect(apiData[0].id).toBe(villageBoundarieses[0].id);
    expect(apiData[0].name).toBe(villageBoundarieses[0].name);
    expect(apiData[1].id).toBe(villageBoundarieses[1].id);
    expect(apiData[1].name).toBe(villageBoundarieses[1].name);
  });
});
