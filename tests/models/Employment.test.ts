import Model from '@/models/Model';
import Employment, { IncomingApiData } from '@/models/Employment';
import { describe, expect, it } from 'vitest';

describe('Employment', () => {
  it('should be a valid model', () => {
    expect(Employment).toBeDefined();
    expect(Employment.prototype).toBeDefined();
    expect(Employment.prototype.constructor).toBeDefined();
    expect(Employment.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.employment).toBe(Employment);
  });

  it('should be able to create a new Employment', () => {
    const employment = new Employment(1, 'Malik');

    expect(employment).toBeDefined();
    expect(employment.id).toBe(1);
    expect(employment.name).toBe('Malik');
  });

  it('should be able to create a new Employment from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const employment = Employment.fromApiData(apiData);

    expect(employment).toBeDefined();
    expect(employment.id).toBe(apiData.id);
    expect(employment.name).toBe(apiData.name);
  });

  it('should be able to create a new Employment array from API data array', () => {
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
    const employments = Employment.fromApiData(apiData);

    expect(employments).toBeDefined();
    expect(employments.length).toBe(apiData.length);
    expect(employments[0].id).toBe(apiData[0].id);
    expect(employments[0].name).toBe(apiData[0].name);
    expect(employments[1].id).toBe(apiData[1].id);
    expect(employments[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Employment to API data', () => {
    const employment = new Employment(1, 'Malik');
    const apiData = Employment.toApiData(employment);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(employment.id);
    expect(apiData.name).toBe(employment.name);
  });

  it('should be able to convert Employment array to API data array', () => {
    const employments = [new Employment(1, 'Malik'), new Employment(2, 'Fauzan')];
    const apiData = Employment.toApiData(employments);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(employments.length);
    expect(apiData[0].id).toBe(employments[0].id);
    expect(apiData[0].name).toBe(employments[0].name);
    expect(apiData[1].id).toBe(employments[1].id);
    expect(apiData[1].name).toBe(employments[1].name);
  });
});
