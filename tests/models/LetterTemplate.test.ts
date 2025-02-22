import Model from '@/models/Model';
import LetterTemplate, { IncomingApiData } from '@/models/LetterTemplate';
import { describe, expect, it } from 'vitest';

describe('LetterTemplate', () => {
  it('should be a valid model', () => {
    expect(LetterTemplate).toBeDefined();
    expect(LetterTemplate.prototype).toBeDefined();
    expect(LetterTemplate.prototype.constructor).toBeDefined();
    expect(LetterTemplate.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.letter_template).toBe(LetterTemplate);
  });

  it('should be able to create a new Letter Template', () => {
    const letterTemplate = new LetterTemplate(1, 'Malik');

    expect(letterTemplate).toBeDefined();
    expect(letterTemplate.id).toBe(1);
    expect(letterTemplate.name).toBe('Malik');
  });

  it('should be able to create a new Letter Template from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const letterTemplate = LetterTemplate.fromApiData(apiData);

    expect(letterTemplate).toBeDefined();
    expect(letterTemplate.id).toBe(apiData.id);
    expect(letterTemplate.name).toBe(apiData.name);
  });

  it('should be able to create a new Letter Template array from API data array', () => {
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
    const letterTemplates = LetterTemplate.fromApiData(apiData);

    expect(letterTemplates).toBeDefined();
    expect(letterTemplates.length).toBe(apiData.length);
    expect(letterTemplates[0].id).toBe(apiData[0].id);
    expect(letterTemplates[0].name).toBe(apiData[0].name);
    expect(letterTemplates[1].id).toBe(apiData[1].id);
    expect(letterTemplates[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Letter Template to API data', () => {
    const letterTemplate = new LetterTemplate(1, 'Malik');
    const apiData = LetterTemplate.toApiData(letterTemplate);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(letterTemplate.id);
    expect(apiData.name).toBe(letterTemplate.name);
  });

  it('should be able to convert Letter Template array to API data array', () => {
    const letterTemplates = [new LetterTemplate(1, 'Malik'), new LetterTemplate(2, 'Fauzan')];
    const apiData = LetterTemplate.toApiData(letterTemplates);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(letterTemplates.length);
    expect(apiData[0].id).toBe(letterTemplates[0].id);
    expect(apiData[0].name).toBe(letterTemplates[0].name);
    expect(apiData[1].id).toBe(letterTemplates[1].id);
    expect(apiData[1].name).toBe(letterTemplates[1].name);
  });
});
