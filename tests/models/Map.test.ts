import Model from '@/models/Model';
import Map, { IncomingApiData } from '@/models/Map';
import { describe, expect, it } from 'vitest';

describe('Map', () => {
  it('should be a valid model', () => {
    expect(Map).toBeDefined();
    expect(Map.prototype).toBeDefined();
    expect(Map.prototype.constructor).toBeDefined();
    expect(Map.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.map).toBe(Map);
  });

  it('should be able to create a new Map', () => {
    const map = new Map(1, 'Malik');

    expect(map).toBeDefined();
    expect(map.id).toBe(1);
    expect(map.name).toBe('Malik');
  });

  it('should be able to create a new Map from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const map = Map.fromApiData(apiData);

    expect(map).toBeDefined();
    expect(map.id).toBe(apiData.id);
    expect(map.name).toBe(apiData.name);
  });

  it('should be able to create a new Map array from API data array', () => {
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
    const maps = Map.fromApiData(apiData);

    expect(maps).toBeDefined();
    expect(maps.length).toBe(apiData.length);
    expect(maps[0].id).toBe(apiData[0].id);
    expect(maps[0].name).toBe(apiData[0].name);
    expect(maps[1].id).toBe(apiData[1].id);
    expect(maps[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Map to API data', () => {
    const map = new Map(1, 'Malik');
    const apiData = Map.toApiData(map);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(map.id);
    expect(apiData.name).toBe(map.name);
  });

  it('should be able to convert Map array to API data array', () => {
    const maps = [new Map(1, 'Malik'), new Map(2, 'Fauzan')];
    const apiData = Map.toApiData(maps);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(maps.length);
    expect(apiData[0].id).toBe(maps[0].id);
    expect(apiData[0].name).toBe(maps[0].name);
    expect(apiData[1].id).toBe(maps[1].id);
    expect(apiData[1].name).toBe(maps[1].name);
  });
});
