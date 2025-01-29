import Model from '@/models/Model';
import LegalProducts, { IncomingApiData } from '@/models/LegalProducts';
import { describe, expect, it } from 'vitest';

describe('LegalProducts', () => {
  it('should be a valid model', () => {
    expect(LegalProducts).toBeDefined();
    expect(LegalProducts.prototype).toBeDefined();
    expect(LegalProducts.prototype.constructor).toBeDefined();
    expect(LegalProducts.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.legal_products).toBe(LegalProducts);
  });

  it('should be able to create a new Legal Products', () => {
    const legalProducts = new LegalProducts(1, 'Malik');

    expect(legalProducts).toBeDefined();
    expect(legalProducts.id).toBe(1);
    expect(legalProducts.name).toBe('Malik');
  });

  it('should be able to create a new Legal Products from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const legalProducts = LegalProducts.fromApiData(apiData);

    expect(legalProducts).toBeDefined();
    expect(legalProducts.id).toBe(apiData.id);
    expect(legalProducts.name).toBe(apiData.name);
  });

  it('should be able to create a new Legal Products array from API data array', () => {
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
    const legalProductses = LegalProducts.fromApiData(apiData);

    expect(legalProductses).toBeDefined();
    expect(legalProductses.length).toBe(apiData.length);
    expect(legalProductses[0].id).toBe(apiData[0].id);
    expect(legalProductses[0].name).toBe(apiData[0].name);
    expect(legalProductses[1].id).toBe(apiData[1].id);
    expect(legalProductses[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Legal Products to API data', () => {
    const legalProducts = new LegalProducts(1, 'Malik');
    const apiData = LegalProducts.toApiData(legalProducts);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(legalProducts.id);
    expect(apiData.name).toBe(legalProducts.name);
  });

  it('should be able to convert Legal Products array to API data array', () => {
    const legalProductses = [new LegalProducts(1, 'Malik'), new LegalProducts(2, 'Fauzan')];
    const apiData = LegalProducts.toApiData(legalProductses);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(legalProductses.length);
    expect(apiData[0].id).toBe(legalProductses[0].id);
    expect(apiData[0].name).toBe(legalProductses[0].name);
    expect(apiData[1].id).toBe(legalProductses[1].id);
    expect(apiData[1].name).toBe(legalProductses[1].name);
  });
});
