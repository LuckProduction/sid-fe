import Model from '@/models/Model';
import Comunity, { IncomingApiData } from '@/models/Comunity';
import { describe, expect, it } from 'vitest';

describe('Comunity', () => {
  it('should be a valid model', () => {
    expect(Comunity).toBeDefined();
    expect(Comunity.prototype).toBeDefined();
    expect(Comunity.prototype.constructor).toBeDefined();
    expect(Comunity.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.comunity).toBe(Comunity);
  });

  it('should be able to create a new Comunity', () => {
    const comunity = new Comunity(1, 'Malik');

    expect(comunity).toBeDefined();
    expect(comunity.id).toBe(1);
    expect(comunity.name).toBe('Malik');
  });

  it('should be able to create a new Comunity from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const comunity = Comunity.fromApiData(apiData);

    expect(comunity).toBeDefined();
    expect(comunity.id).toBe(apiData.id);
    expect(comunity.name).toBe(apiData.name);
  });

  it('should be able to create a new Comunity array from API data array', () => {
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
    const comunitys = Comunity.fromApiData(apiData);

    expect(comunitys).toBeDefined();
    expect(comunitys.length).toBe(apiData.length);
    expect(comunitys[0].id).toBe(apiData[0].id);
    expect(comunitys[0].name).toBe(apiData[0].name);
    expect(comunitys[1].id).toBe(apiData[1].id);
    expect(comunitys[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Comunity to API data', () => {
    const comunity = new Comunity(1, 'Malik');
    const apiData = Comunity.toApiData(comunity);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(comunity.id);
    expect(apiData.name).toBe(comunity.name);
  });

  it('should be able to convert Comunity array to API data array', () => {
    const comunitys = [new Comunity(1, 'Malik'), new Comunity(2, 'Fauzan')];
    const apiData = Comunity.toApiData(comunitys);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(comunitys.length);
    expect(apiData[0].id).toBe(comunitys[0].id);
    expect(apiData[0].name).toBe(comunitys[0].name);
    expect(apiData[1].id).toBe(comunitys[1].id);
    expect(apiData[1].name).toBe(comunitys[1].name);
  });
});
