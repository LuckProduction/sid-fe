import Model from '@/models/Model';
import Speech, { IncomingApiData } from '@/models/Speech';
import { describe, expect, it } from 'vitest';

describe('Speech', () => {
  it('should be a valid model', () => {
    expect(Speech).toBeDefined();
    expect(Speech.prototype).toBeDefined();
    expect(Speech.prototype.constructor).toBeDefined();
    expect(Speech.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.speech).toBe(Speech);
  });

  it('should be able to create a new Speech', () => {
    const speech = new Speech(1, 'Malik');

    expect(speech).toBeDefined();
    expect(speech.id).toBe(1);
    expect(speech.name).toBe('Malik');
  });

  it('should be able to create a new Speech from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const speech = Speech.fromApiData(apiData);

    expect(speech).toBeDefined();
    expect(speech.id).toBe(apiData.id);
    expect(speech.name).toBe(apiData.name);
  });

  it('should be able to create a new Speech array from API data array', () => {
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
    const speechs = Speech.fromApiData(apiData);

    expect(speechs).toBeDefined();
    expect(speechs.length).toBe(apiData.length);
    expect(speechs[0].id).toBe(apiData[0].id);
    expect(speechs[0].name).toBe(apiData[0].name);
    expect(speechs[1].id).toBe(apiData[1].id);
    expect(speechs[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Speech to API data', () => {
    const speech = new Speech(1, 'Malik');
    const apiData = Speech.toApiData(speech);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(speech.id);
    expect(apiData.name).toBe(speech.name);
  });

  it('should be able to convert Speech array to API data array', () => {
    const speechs = [new Speech(1, 'Malik'), new Speech(2, 'Fauzan')];
    const apiData = Speech.toApiData(speechs);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(speechs.length);
    expect(apiData[0].id).toBe(speechs[0].id);
    expect(apiData[0].name).toBe(speechs[0].name);
    expect(apiData[1].id).toBe(speechs[1].id);
    expect(apiData[1].name).toBe(speechs[1].name);
  });
});
