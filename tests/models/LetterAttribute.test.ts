import Model from '@/models/Model';
import LetterAttribute, { IncomingApiData } from '@/models/LetterAttribute';
import { describe, expect, it } from 'vitest';

describe('LetterAttribute', () => {
  it('should be a valid model', () => {
    expect(LetterAttribute).toBeDefined();
    expect(LetterAttribute.prototype).toBeDefined();
    expect(LetterAttribute.prototype.constructor).toBeDefined();
    expect(LetterAttribute.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.letter_attribute).toBe(LetterAttribute);
  });

  it('should be able to create a new Letter Attribute', () => {
    const letterAttribute = new LetterAttribute(1, 'Malik');

    expect(letterAttribute).toBeDefined();
    expect(letterAttribute.id).toBe(1);
    expect(letterAttribute.name).toBe('Malik');
  });

  it('should be able to create a new Letter Attribute from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const letterAttribute = LetterAttribute.fromApiData(apiData);

    expect(letterAttribute).toBeDefined();
    expect(letterAttribute.id).toBe(apiData.id);
    expect(letterAttribute.name).toBe(apiData.name);
  });

  it('should be able to create a new Letter Attribute array from API data array', () => {
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
    const letterAttributes = LetterAttribute.fromApiData(apiData);

    expect(letterAttributes).toBeDefined();
    expect(letterAttributes.length).toBe(apiData.length);
    expect(letterAttributes[0].id).toBe(apiData[0].id);
    expect(letterAttributes[0].name).toBe(apiData[0].name);
    expect(letterAttributes[1].id).toBe(apiData[1].id);
    expect(letterAttributes[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Letter Attribute to API data', () => {
    const letterAttribute = new LetterAttribute(1, 'Malik');
    const apiData = LetterAttribute.toApiData(letterAttribute);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(letterAttribute.id);
    expect(apiData.name).toBe(letterAttribute.name);
  });

  it('should be able to convert Letter Attribute array to API data array', () => {
    const letterAttributes = [new LetterAttribute(1, 'Malik'), new LetterAttribute(2, 'Fauzan')];
    const apiData = LetterAttribute.toApiData(letterAttributes);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(letterAttributes.length);
    expect(apiData[0].id).toBe(letterAttributes[0].id);
    expect(apiData[0].name).toBe(letterAttributes[0].name);
    expect(apiData[1].id).toBe(letterAttributes[1].id);
    expect(apiData[1].name).toBe(letterAttributes[1].name);
  });
});
