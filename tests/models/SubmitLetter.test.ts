import Model from '@/models/Model';
import SubmitLetter, { IncomingApiData } from '@/models/SubmitLetter';
import { describe, expect, it } from 'vitest';

describe('SubmitLetter', () => {
  it('should be a valid model', () => {
    expect(SubmitLetter).toBeDefined();
    expect(SubmitLetter.prototype).toBeDefined();
    expect(SubmitLetter.prototype.constructor).toBeDefined();
    expect(SubmitLetter.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.submit_letter).toBe(SubmitLetter);
  });

  it('should be able to create a new Submit Letter', () => {
    const submitLetter = new SubmitLetter(1, 'Malik');

    expect(submitLetter).toBeDefined();
    expect(submitLetter.id).toBe(1);
    expect(submitLetter.name).toBe('Malik');
  });

  it('should be able to create a new Submit Letter from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const submitLetter = SubmitLetter.fromApiData(apiData);

    expect(submitLetter).toBeDefined();
    expect(submitLetter.id).toBe(apiData.id);
    expect(submitLetter.name).toBe(apiData.name);
  });

  it('should be able to create a new Submit Letter array from API data array', () => {
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
    const submitLetters = SubmitLetter.fromApiData(apiData);

    expect(submitLetters).toBeDefined();
    expect(submitLetters.length).toBe(apiData.length);
    expect(submitLetters[0].id).toBe(apiData[0].id);
    expect(submitLetters[0].name).toBe(apiData[0].name);
    expect(submitLetters[1].id).toBe(apiData[1].id);
    expect(submitLetters[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Submit Letter to API data', () => {
    const submitLetter = new SubmitLetter(1, 'Malik');
    const apiData = SubmitLetter.toApiData(submitLetter);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(submitLetter.id);
    expect(apiData.name).toBe(submitLetter.name);
  });

  it('should be able to convert Submit Letter array to API data array', () => {
    const submitLetters = [new SubmitLetter(1, 'Malik'), new SubmitLetter(2, 'Fauzan')];
    const apiData = SubmitLetter.toApiData(submitLetters);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(submitLetters.length);
    expect(apiData[0].id).toBe(submitLetters[0].id);
    expect(apiData[0].name).toBe(submitLetters[0].name);
    expect(apiData[1].id).toBe(submitLetters[1].id);
    expect(apiData[1].name).toBe(submitLetters[1].name);
  });
});
