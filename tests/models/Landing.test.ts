import Model from '@/models/Model';
import Landing, { IncomingApiData } from '@/models/Landing';
import { describe, expect, it } from 'vitest';

describe('Landing', () => {
  it('should be a valid model', () => {
    expect(Landing).toBeDefined();
    expect(Landing.prototype).toBeDefined();
    expect(Landing.prototype.constructor).toBeDefined();
    expect(Landing.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.landing).toBe(Landing);
  });

  it('should be able to create a new Landing', () => {
    const landing = new Landing(1, 'Malik');

    expect(landing).toBeDefined();
    expect(landing.id).toBe(1);
    expect(landing.name).toBe('Malik');
  });

  it('should be able to create a new Landing from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const landing = Landing.fromApiData(apiData);

    expect(landing).toBeDefined();
    expect(landing.id).toBe(apiData.id);
    expect(landing.name).toBe(apiData.name);
  });

  it('should be able to create a new Landing array from API data array', () => {
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
    const landings = Landing.fromApiData(apiData);

    expect(landings).toBeDefined();
    expect(landings.length).toBe(apiData.length);
    expect(landings[0].id).toBe(apiData[0].id);
    expect(landings[0].name).toBe(apiData[0].name);
    expect(landings[1].id).toBe(apiData[1].id);
    expect(landings[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Landing to API data', () => {
    const landing = new Landing(1, 'Malik');
    const apiData = Landing.toApiData(landing);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(landing.id);
    expect(apiData.name).toBe(landing.name);
  });

  it('should be able to convert Landing array to API data array', () => {
    const landings = [new Landing(1, 'Malik'), new Landing(2, 'Fauzan')];
    const apiData = Landing.toApiData(landings);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(landings.length);
    expect(apiData[0].id).toBe(landings[0].id);
    expect(apiData[0].name).toBe(landings[0].name);
    expect(apiData[1].id).toBe(landings[1].id);
    expect(apiData[1].name).toBe(landings[1].name);
  });
});
