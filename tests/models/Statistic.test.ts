import Model from '@/models/Model';
import Statistic, { IncomingApiData } from '@/models/Statistic';
import { describe, expect, it } from 'vitest';

describe('Statistic', () => {
  it('should be a valid model', () => {
    expect(Statistic).toBeDefined();
    expect(Statistic.prototype).toBeDefined();
    expect(Statistic.prototype.constructor).toBeDefined();
    expect(Statistic.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.statistic).toBe(Statistic);
  });

  it('should be able to create a new Statistic', () => {
    const statistic = new Statistic(1, 'Malik');

    expect(statistic).toBeDefined();
    expect(statistic.id).toBe(1);
    expect(statistic.name).toBe('Malik');
  });

  it('should be able to create a new Statistic from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const statistic = Statistic.fromApiData(apiData);

    expect(statistic).toBeDefined();
    expect(statistic.id).toBe(apiData.id);
    expect(statistic.name).toBe(apiData.name);
  });

  it('should be able to create a new Statistic array from API data array', () => {
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
    const statistics = Statistic.fromApiData(apiData);

    expect(statistics).toBeDefined();
    expect(statistics.length).toBe(apiData.length);
    expect(statistics[0].id).toBe(apiData[0].id);
    expect(statistics[0].name).toBe(apiData[0].name);
    expect(statistics[1].id).toBe(apiData[1].id);
    expect(statistics[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Statistic to API data', () => {
    const statistic = new Statistic(1, 'Malik');
    const apiData = Statistic.toApiData(statistic);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(statistic.id);
    expect(apiData.name).toBe(statistic.name);
  });

  it('should be able to convert Statistic array to API data array', () => {
    const statistics = [new Statistic(1, 'Malik'), new Statistic(2, 'Fauzan')];
    const apiData = Statistic.toApiData(statistics);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(statistics.length);
    expect(apiData[0].id).toBe(statistics[0].id);
    expect(apiData[0].name).toBe(statistics[0].name);
    expect(apiData[1].id).toBe(statistics[1].id);
    expect(apiData[1].name).toBe(statistics[1].name);
  });
});
