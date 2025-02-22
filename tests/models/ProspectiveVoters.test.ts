import Model from '@/models/Model';
import ProspectiveVoters, { IncomingApiData } from '@/models/ProspectiveVoters';
import { describe, expect, it } from 'vitest';

describe('ProspectiveVoters', () => {
  it('should be a valid model', () => {
    expect(ProspectiveVoters).toBeDefined();
    expect(ProspectiveVoters.prototype).toBeDefined();
    expect(ProspectiveVoters.prototype.constructor).toBeDefined();
    expect(ProspectiveVoters.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.prospective_voters).toBe(ProspectiveVoters);
  });

  it('should be able to create a new Prospective Voters', () => {
    const prospectiveVoters = new ProspectiveVoters(1, 'Malik');

    expect(prospectiveVoters).toBeDefined();
    expect(prospectiveVoters.id).toBe(1);
    expect(prospectiveVoters.name).toBe('Malik');
  });

  it('should be able to create a new Prospective Voters from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const prospectiveVoters = ProspectiveVoters.fromApiData(apiData);

    expect(prospectiveVoters).toBeDefined();
    expect(prospectiveVoters.id).toBe(apiData.id);
    expect(prospectiveVoters.name).toBe(apiData.name);
  });

  it('should be able to create a new Prospective Voters array from API data array', () => {
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
    const prospectiveVoterses = ProspectiveVoters.fromApiData(apiData);

    expect(prospectiveVoterses).toBeDefined();
    expect(prospectiveVoterses.length).toBe(apiData.length);
    expect(prospectiveVoterses[0].id).toBe(apiData[0].id);
    expect(prospectiveVoterses[0].name).toBe(apiData[0].name);
    expect(prospectiveVoterses[1].id).toBe(apiData[1].id);
    expect(prospectiveVoterses[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Prospective Voters to API data', () => {
    const prospectiveVoters = new ProspectiveVoters(1, 'Malik');
    const apiData = ProspectiveVoters.toApiData(prospectiveVoters);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(prospectiveVoters.id);
    expect(apiData.name).toBe(prospectiveVoters.name);
  });

  it('should be able to convert Prospective Voters array to API data array', () => {
    const prospectiveVoterses = [new ProspectiveVoters(1, 'Malik'), new ProspectiveVoters(2, 'Fauzan')];
    const apiData = ProspectiveVoters.toApiData(prospectiveVoterses);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(prospectiveVoterses.length);
    expect(apiData[0].id).toBe(prospectiveVoterses[0].id);
    expect(apiData[0].name).toBe(prospectiveVoterses[0].name);
    expect(apiData[1].id).toBe(prospectiveVoterses[1].id);
    expect(apiData[1].name).toBe(prospectiveVoterses[1].name);
  });
});
