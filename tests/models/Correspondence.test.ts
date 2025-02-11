import Model from '@/models/Model';
import Correspondence, { IncomingApiData } from '@/models/Correspondence';
import { describe, expect, it } from 'vitest';

describe('Correspondence', () => {
  it('should be a valid model', () => {
    expect(Correspondence).toBeDefined();
    expect(Correspondence.prototype).toBeDefined();
    expect(Correspondence.prototype.constructor).toBeDefined();
    expect(Correspondence.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.correspondence).toBe(Correspondence);
  });

  it('should be able to create a new Correspondence', () => {
    const correspondence = new Correspondence(1, 'Malik');

    expect(correspondence).toBeDefined();
    expect(correspondence.id).toBe(1);
    expect(correspondence.name).toBe('Malik');
  });

  it('should be able to create a new Correspondence from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const correspondence = Correspondence.fromApiData(apiData);

    expect(correspondence).toBeDefined();
    expect(correspondence.id).toBe(apiData.id);
    expect(correspondence.name).toBe(apiData.name);
  });

  it('should be able to create a new Correspondence array from API data array', () => {
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
    const correspondences = Correspondence.fromApiData(apiData);

    expect(correspondences).toBeDefined();
    expect(correspondences.length).toBe(apiData.length);
    expect(correspondences[0].id).toBe(apiData[0].id);
    expect(correspondences[0].name).toBe(apiData[0].name);
    expect(correspondences[1].id).toBe(apiData[1].id);
    expect(correspondences[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Correspondence to API data', () => {
    const correspondence = new Correspondence(1, 'Malik');
    const apiData = Correspondence.toApiData(correspondence);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(correspondence.id);
    expect(apiData.name).toBe(correspondence.name);
  });

  it('should be able to convert Correspondence array to API data array', () => {
    const correspondences = [new Correspondence(1, 'Malik'), new Correspondence(2, 'Fauzan')];
    const apiData = Correspondence.toApiData(correspondences);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(correspondences.length);
    expect(apiData[0].id).toBe(correspondences[0].id);
    expect(apiData[0].name).toBe(correspondences[0].name);
    expect(apiData[1].id).toBe(correspondences[1].id);
    expect(apiData[1].name).toBe(correspondences[1].name);
  });
});
