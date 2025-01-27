import Model from '@/models/Model';
import Hamlet, { IncomingApiData } from '@/models/Hamlet';
import { describe, expect, it } from 'vitest';

describe('Hamlet', () => {
  it('should be a valid model', () => {
    expect(Hamlet).toBeDefined();
    expect(Hamlet.prototype).toBeDefined();
    expect(Hamlet.prototype.constructor).toBeDefined();
    expect(Hamlet.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.hamlet).toBe(Hamlet);
  });

  it('should be able to create a new Hamlet', () => {
    const hamlet = new Hamlet(1, 'Malik');

    expect(hamlet).toBeDefined();
    expect(hamlet.id).toBe(1);
    expect(hamlet.name).toBe('Malik');
  });

  it('should be able to create a new Hamlet from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const hamlet = Hamlet.fromApiData(apiData);

    expect(hamlet).toBeDefined();
    expect(hamlet.id).toBe(apiData.id);
    expect(hamlet.name).toBe(apiData.name);
  });

  it('should be able to create a new Hamlet array from API data array', () => {
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
    const hamlets = Hamlet.fromApiData(apiData);

    expect(hamlets).toBeDefined();
    expect(hamlets.length).toBe(apiData.length);
    expect(hamlets[0].id).toBe(apiData[0].id);
    expect(hamlets[0].name).toBe(apiData[0].name);
    expect(hamlets[1].id).toBe(apiData[1].id);
    expect(hamlets[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Hamlet to API data', () => {
    const hamlet = new Hamlet(1, 'Malik');
    const apiData = Hamlet.toApiData(hamlet);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(hamlet.id);
    expect(apiData.name).toBe(hamlet.name);
  });

  it('should be able to convert Hamlet array to API data array', () => {
    const hamlets = [new Hamlet(1, 'Malik'), new Hamlet(2, 'Fauzan')];
    const apiData = Hamlet.toApiData(hamlets);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(hamlets.length);
    expect(apiData[0].id).toBe(hamlets[0].id);
    expect(apiData[0].name).toBe(hamlets[0].name);
    expect(apiData[1].id).toBe(hamlets[1].id);
    expect(apiData[1].name).toBe(hamlets[1].name);
  });
});
