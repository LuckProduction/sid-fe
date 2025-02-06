import Model from '@/models/Model';
import Beneficiary, { IncomingApiData } from '@/models/Beneficiary';
import { describe, expect, it } from 'vitest';

describe('Beneficiary', () => {
  it('should be a valid model', () => {
    expect(Beneficiary).toBeDefined();
    expect(Beneficiary.prototype).toBeDefined();
    expect(Beneficiary.prototype.constructor).toBeDefined();
    expect(Beneficiary.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.beneficiary).toBe(Beneficiary);
  });

  it('should be able to create a new Beneficiary', () => {
    const beneficiary = new Beneficiary(1, 'Malik');

    expect(beneficiary).toBeDefined();
    expect(beneficiary.id).toBe(1);
    expect(beneficiary.name).toBe('Malik');
  });

  it('should be able to create a new Beneficiary from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const beneficiary = Beneficiary.fromApiData(apiData);

    expect(beneficiary).toBeDefined();
    expect(beneficiary.id).toBe(apiData.id);
    expect(beneficiary.name).toBe(apiData.name);
  });

  it('should be able to create a new Beneficiary array from API data array', () => {
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
    const beneficiarys = Beneficiary.fromApiData(apiData);

    expect(beneficiarys).toBeDefined();
    expect(beneficiarys.length).toBe(apiData.length);
    expect(beneficiarys[0].id).toBe(apiData[0].id);
    expect(beneficiarys[0].name).toBe(apiData[0].name);
    expect(beneficiarys[1].id).toBe(apiData[1].id);
    expect(beneficiarys[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Beneficiary to API data', () => {
    const beneficiary = new Beneficiary(1, 'Malik');
    const apiData = Beneficiary.toApiData(beneficiary);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(beneficiary.id);
    expect(apiData.name).toBe(beneficiary.name);
  });

  it('should be able to convert Beneficiary array to API data array', () => {
    const beneficiarys = [new Beneficiary(1, 'Malik'), new Beneficiary(2, 'Fauzan')];
    const apiData = Beneficiary.toApiData(beneficiarys);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(beneficiarys.length);
    expect(apiData[0].id).toBe(beneficiarys[0].id);
    expect(apiData[0].name).toBe(beneficiarys[0].name);
    expect(apiData[1].id).toBe(beneficiarys[1].id);
    expect(apiData[1].name).toBe(beneficiarys[1].name);
  });
});
