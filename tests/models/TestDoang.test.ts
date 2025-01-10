import Model from '@/models/Model';
import TestDoang, { IncomingApiData } from '@/models/TestDoang';
import { describe, expect, it } from 'vitest';

describe('TestDoang', () => {
  it('should be a valid model', () => {
    expect(TestDoang).toBeDefined();
    expect(TestDoang.prototype).toBeDefined();
    expect(TestDoang.prototype.constructor).toBeDefined();
    expect(TestDoang.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.test_doang).toBe(TestDoang);
  });

  it('should be able to create a new Test Doang', () => {
    const testDoang = new TestDoang(1, 'Malik');

    expect(testDoang).toBeDefined();
    expect(testDoang.id).toBe(1);
    expect(testDoang.name).toBe('Malik');
  });

  it('should be able to create a new Test Doang from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const testDoang = TestDoang.fromApiData(apiData);

    expect(testDoang).toBeDefined();
    expect(testDoang.id).toBe(apiData.id);
    expect(testDoang.name).toBe(apiData.name);
  });

  it('should be able to create a new Test Doang array from API data array', () => {
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
    const testDoangs = TestDoang.fromApiData(apiData);

    expect(testDoangs).toBeDefined();
    expect(testDoangs.length).toBe(apiData.length);
    expect(testDoangs[0].id).toBe(apiData[0].id);
    expect(testDoangs[0].name).toBe(apiData[0].name);
    expect(testDoangs[1].id).toBe(apiData[1].id);
    expect(testDoangs[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Test Doang to API data', () => {
    const testDoang = new TestDoang(1, 'Malik');
    const apiData = TestDoang.toApiData(testDoang);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(testDoang.id);
    expect(apiData.name).toBe(testDoang.name);
  });

  it('should be able to convert Test Doang array to API data array', () => {
    const testDoangs = [new TestDoang(1, 'Malik'), new TestDoang(2, 'Fauzan')];
    const apiData = TestDoang.toApiData(testDoangs);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(testDoangs.length);
    expect(apiData[0].id).toBe(testDoangs[0].id);
    expect(apiData[0].name).toBe(testDoangs[0].name);
    expect(apiData[1].id).toBe(testDoangs[1].id);
    expect(apiData[1].name).toBe(testDoangs[1].name);
  });
});
