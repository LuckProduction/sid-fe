import Model from '@/models/Model';
import LetterRequest, { IncomingApiData } from '@/models/LetterRequest';
import { describe, expect, it } from 'vitest';

describe('LetterRequest', () => {
  it('should be a valid model', () => {
    expect(LetterRequest).toBeDefined();
    expect(LetterRequest.prototype).toBeDefined();
    expect(LetterRequest.prototype.constructor).toBeDefined();
    expect(LetterRequest.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.letter_request).toBe(LetterRequest);
  });

  it('should be able to create a new Letter Request', () => {
    const letterRequest = new LetterRequest(1, 'Malik');

    expect(letterRequest).toBeDefined();
    expect(letterRequest.id).toBe(1);
    expect(letterRequest.name).toBe('Malik');
  });

  it('should be able to create a new Letter Request from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const letterRequest = LetterRequest.fromApiData(apiData);

    expect(letterRequest).toBeDefined();
    expect(letterRequest.id).toBe(apiData.id);
    expect(letterRequest.name).toBe(apiData.name);
  });

  it('should be able to create a new Letter Request array from API data array', () => {
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
    const letterRequests = LetterRequest.fromApiData(apiData);

    expect(letterRequests).toBeDefined();
    expect(letterRequests.length).toBe(apiData.length);
    expect(letterRequests[0].id).toBe(apiData[0].id);
    expect(letterRequests[0].name).toBe(apiData[0].name);
    expect(letterRequests[1].id).toBe(apiData[1].id);
    expect(letterRequests[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Letter Request to API data', () => {
    const letterRequest = new LetterRequest(1, 'Malik');
    const apiData = LetterRequest.toApiData(letterRequest);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(letterRequest.id);
    expect(apiData.name).toBe(letterRequest.name);
  });

  it('should be able to convert Letter Request array to API data array', () => {
    const letterRequests = [new LetterRequest(1, 'Malik'), new LetterRequest(2, 'Fauzan')];
    const apiData = LetterRequest.toApiData(letterRequests);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(letterRequests.length);
    expect(apiData[0].id).toBe(letterRequests[0].id);
    expect(apiData[0].name).toBe(letterRequests[0].name);
    expect(apiData[1].id).toBe(letterRequests[1].id);
    expect(apiData[1].name).toBe(letterRequests[1].name);
  });
});
