import Model from '@/models/Model';
import VisiMisi, { IncomingApiData } from '@/models/VisiMisi';
import { describe, expect, it } from 'vitest';

describe('VisiMisi', () => {
  it('should be a valid model', () => {
    expect(VisiMisi).toBeDefined();
    expect(VisiMisi.prototype).toBeDefined();
    expect(VisiMisi.prototype.constructor).toBeDefined();
    expect(VisiMisi.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.visi_misi).toBe(VisiMisi);
  });

  it('should be able to create a new Visi Misi', () => {
    const visiMisi = new VisiMisi(1, 'Malik');

    expect(visiMisi).toBeDefined();
    expect(visiMisi.id).toBe(1);
    expect(visiMisi.name).toBe('Malik');
  });

  it('should be able to create a new Visi Misi from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const visiMisi = VisiMisi.fromApiData(apiData);

    expect(visiMisi).toBeDefined();
    expect(visiMisi.id).toBe(apiData.id);
    expect(visiMisi.name).toBe(apiData.name);
  });

  it('should be able to create a new Visi Misi array from API data array', () => {
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
    const visiMisis = VisiMisi.fromApiData(apiData);

    expect(visiMisis).toBeDefined();
    expect(visiMisis.length).toBe(apiData.length);
    expect(visiMisis[0].id).toBe(apiData[0].id);
    expect(visiMisis[0].name).toBe(apiData[0].name);
    expect(visiMisis[1].id).toBe(apiData[1].id);
    expect(visiMisis[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Visi Misi to API data', () => {
    const visiMisi = new VisiMisi(1, 'Malik');
    const apiData = VisiMisi.toApiData(visiMisi);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(visiMisi.id);
    expect(apiData.name).toBe(visiMisi.name);
  });

  it('should be able to convert Visi Misi array to API data array', () => {
    const visiMisis = [new VisiMisi(1, 'Malik'), new VisiMisi(2, 'Fauzan')];
    const apiData = VisiMisi.toApiData(visiMisis);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(visiMisis.length);
    expect(apiData[0].id).toBe(visiMisis[0].id);
    expect(apiData[0].name).toBe(visiMisis[0].name);
    expect(apiData[1].id).toBe(visiMisis[1].id);
    expect(apiData[1].name).toBe(visiMisis[1].name);
  });
});
