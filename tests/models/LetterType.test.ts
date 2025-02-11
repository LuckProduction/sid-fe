import Model from '@/models/Model';
import LetterType, { IncomingApiData } from '@/models/LetterType';
import { describe, expect, it } from 'vitest';

describe('LetterType', () => {
  it('should be a valid model', () => {
    expect(LetterType).toBeDefined();
    expect(LetterType.prototype).toBeDefined();
    expect(LetterType.prototype.constructor).toBeDefined();
    expect(LetterType.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.letter_type).toBe(LetterType);
  });

  it('should be able to create a new Letter Type', () => {
    const letterType = new LetterType(1, 'Malik');

    expect(letterType).toBeDefined();
    expect(letterType.id).toBe(1);
    expect(letterType.name).toBe('Malik');
  });

  it('should be able to create a new Letter Type from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const letterType = LetterType.fromApiData(apiData);

    expect(letterType).toBeDefined();
    expect(letterType.id).toBe(apiData.id);
    expect(letterType.name).toBe(apiData.name);
  });

  it('should be able to create a new Letter Type array from API data array', () => {
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
    const letterTypes = LetterType.fromApiData(apiData);

    expect(letterTypes).toBeDefined();
    expect(letterTypes.length).toBe(apiData.length);
    expect(letterTypes[0].id).toBe(apiData[0].id);
    expect(letterTypes[0].name).toBe(apiData[0].name);
    expect(letterTypes[1].id).toBe(apiData[1].id);
    expect(letterTypes[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Letter Type to API data', () => {
    const letterType = new LetterType(1, 'Malik');
    const apiData = LetterType.toApiData(letterType);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(letterType.id);
    expect(apiData.name).toBe(letterType.name);
  });

  it('should be able to convert Letter Type array to API data array', () => {
    const letterTypes = [new LetterType(1, 'Malik'), new LetterType(2, 'Fauzan')];
    const apiData = LetterType.toApiData(letterTypes);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(letterTypes.length);
    expect(apiData[0].id).toBe(letterTypes[0].id);
    expect(apiData[0].name).toBe(letterTypes[0].name);
    expect(apiData[1].id).toBe(letterTypes[1].id);
    expect(apiData[1].name).toBe(letterTypes[1].name);
  });
});
