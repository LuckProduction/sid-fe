import Model from '@/models/Model';
import PublicAssistance, { IncomingApiData } from '@/models/PublicAssistance';
import { describe, expect, it } from 'vitest';

describe('PublicAssistance', () => {
  it('should be a valid model', () => {
    expect(PublicAssistance).toBeDefined();
    expect(PublicAssistance.prototype).toBeDefined();
    expect(PublicAssistance.prototype.constructor).toBeDefined();
    expect(PublicAssistance.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.public_assistance).toBe(PublicAssistance);
  });

  it('should be able to create a new Public Assistance', () => {
    const publicAssistance = new PublicAssistance(1, 'Malik');

    expect(publicAssistance).toBeDefined();
    expect(publicAssistance.id).toBe(1);
    expect(publicAssistance.name).toBe('Malik');
  });

  it('should be able to create a new Public Assistance from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const publicAssistance = PublicAssistance.fromApiData(apiData);

    expect(publicAssistance).toBeDefined();
    expect(publicAssistance.id).toBe(apiData.id);
    expect(publicAssistance.name).toBe(apiData.name);
  });

  it('should be able to create a new Public Assistance array from API data array', () => {
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
    const publicAssistances = PublicAssistance.fromApiData(apiData);

    expect(publicAssistances).toBeDefined();
    expect(publicAssistances.length).toBe(apiData.length);
    expect(publicAssistances[0].id).toBe(apiData[0].id);
    expect(publicAssistances[0].name).toBe(apiData[0].name);
    expect(publicAssistances[1].id).toBe(apiData[1].id);
    expect(publicAssistances[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Public Assistance to API data', () => {
    const publicAssistance = new PublicAssistance(1, 'Malik');
    const apiData = PublicAssistance.toApiData(publicAssistance);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(publicAssistance.id);
    expect(apiData.name).toBe(publicAssistance.name);
  });

  it('should be able to convert Public Assistance array to API data array', () => {
    const publicAssistances = [new PublicAssistance(1, 'Malik'), new PublicAssistance(2, 'Fauzan')];
    const apiData = PublicAssistance.toApiData(publicAssistances);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(publicAssistances.length);
    expect(apiData[0].id).toBe(publicAssistances[0].id);
    expect(apiData[0].name).toBe(publicAssistances[0].name);
    expect(apiData[1].id).toBe(publicAssistances[1].id);
    expect(apiData[1].name).toBe(publicAssistances[1].name);
  });
});
