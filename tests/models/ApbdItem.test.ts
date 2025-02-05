import Model from '@/models/Model';
import ApbdItem, { IncomingApiData } from '@/models/ApbdItem';
import { describe, expect, it } from 'vitest';

describe('ApbdItem', () => {
  it('should be a valid model', () => {
    expect(ApbdItem).toBeDefined();
    expect(ApbdItem.prototype).toBeDefined();
    expect(ApbdItem.prototype.constructor).toBeDefined();
    expect(ApbdItem.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.apbd_item).toBe(ApbdItem);
  });

  it('should be able to create a new Apbd Item', () => {
    const apbdItem = new ApbdItem(1, 'Malik');

    expect(apbdItem).toBeDefined();
    expect(apbdItem.id).toBe(1);
    expect(apbdItem.name).toBe('Malik');
  });

  it('should be able to create a new Apbd Item from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const apbdItem = ApbdItem.fromApiData(apiData);

    expect(apbdItem).toBeDefined();
    expect(apbdItem.id).toBe(apiData.id);
    expect(apbdItem.name).toBe(apiData.name);
  });

  it('should be able to create a new Apbd Item array from API data array', () => {
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
    const apbdItems = ApbdItem.fromApiData(apiData);

    expect(apbdItems).toBeDefined();
    expect(apbdItems.length).toBe(apiData.length);
    expect(apbdItems[0].id).toBe(apiData[0].id);
    expect(apbdItems[0].name).toBe(apiData[0].name);
    expect(apbdItems[1].id).toBe(apiData[1].id);
    expect(apbdItems[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Apbd Item to API data', () => {
    const apbdItem = new ApbdItem(1, 'Malik');
    const apiData = ApbdItem.toApiData(apbdItem);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(apbdItem.id);
    expect(apiData.name).toBe(apbdItem.name);
  });

  it('should be able to convert Apbd Item array to API data array', () => {
    const apbdItems = [new ApbdItem(1, 'Malik'), new ApbdItem(2, 'Fauzan')];
    const apiData = ApbdItem.toApiData(apbdItems);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(apbdItems.length);
    expect(apiData[0].id).toBe(apbdItems[0].id);
    expect(apiData[0].name).toBe(apbdItems[0].name);
    expect(apiData[1].id).toBe(apbdItems[1].id);
    expect(apiData[1].name).toBe(apbdItems[1].name);
  });
});
