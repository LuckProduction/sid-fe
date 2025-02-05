import Model from '@/models/Model';
import ApbdReport, { IncomingApiData } from '@/models/ApbdReport';
import { describe, expect, it } from 'vitest';

describe('ApbdReport', () => {
  it('should be a valid model', () => {
    expect(ApbdReport).toBeDefined();
    expect(ApbdReport.prototype).toBeDefined();
    expect(ApbdReport.prototype.constructor).toBeDefined();
    expect(ApbdReport.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.apbd_report).toBe(ApbdReport);
  });

  it('should be able to create a new Apbd Report', () => {
    const apbdReport = new ApbdReport(1, 'Malik');

    expect(apbdReport).toBeDefined();
    expect(apbdReport.id).toBe(1);
    expect(apbdReport.name).toBe('Malik');
  });

  it('should be able to create a new Apbd Report from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const apbdReport = ApbdReport.fromApiData(apiData);

    expect(apbdReport).toBeDefined();
    expect(apbdReport.id).toBe(apiData.id);
    expect(apbdReport.name).toBe(apiData.name);
  });

  it('should be able to create a new Apbd Report array from API data array', () => {
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
    const apbdReports = ApbdReport.fromApiData(apiData);

    expect(apbdReports).toBeDefined();
    expect(apbdReports.length).toBe(apiData.length);
    expect(apbdReports[0].id).toBe(apiData[0].id);
    expect(apbdReports[0].name).toBe(apiData[0].name);
    expect(apbdReports[1].id).toBe(apiData[1].id);
    expect(apbdReports[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Apbd Report to API data', () => {
    const apbdReport = new ApbdReport(1, 'Malik');
    const apiData = ApbdReport.toApiData(apbdReport);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(apbdReport.id);
    expect(apiData.name).toBe(apbdReport.name);
  });

  it('should be able to convert Apbd Report array to API data array', () => {
    const apbdReports = [new ApbdReport(1, 'Malik'), new ApbdReport(2, 'Fauzan')];
    const apiData = ApbdReport.toApiData(apbdReports);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(apbdReports.length);
    expect(apiData[0].id).toBe(apbdReports[0].id);
    expect(apiData[0].name).toBe(apbdReports[0].name);
    expect(apiData[1].id).toBe(apbdReports[1].id);
    expect(apiData[1].name).toBe(apbdReports[1].name);
  });
});
