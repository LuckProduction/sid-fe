import Model from '@/models/Model';
import InstitutionMember, { IncomingApiData } from '@/models/InstitutionMember';
import { describe, expect, it } from 'vitest';

describe('InstitutionMember', () => {
  it('should be a valid model', () => {
    expect(InstitutionMember).toBeDefined();
    expect(InstitutionMember.prototype).toBeDefined();
    expect(InstitutionMember.prototype.constructor).toBeDefined();
    expect(InstitutionMember.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.institution_member).toBe(InstitutionMember);
  });

  it('should be able to create a new Institution Member', () => {
    const institutionMember = new InstitutionMember(1, 'Malik');

    expect(institutionMember).toBeDefined();
    expect(institutionMember.id).toBe(1);
    expect(institutionMember.name).toBe('Malik');
  });

  it('should be able to create a new Institution Member from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const institutionMember = InstitutionMember.fromApiData(apiData);

    expect(institutionMember).toBeDefined();
    expect(institutionMember.id).toBe(apiData.id);
    expect(institutionMember.name).toBe(apiData.name);
  });

  it('should be able to create a new Institution Member array from API data array', () => {
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
    const institutionMembers = InstitutionMember.fromApiData(apiData);

    expect(institutionMembers).toBeDefined();
    expect(institutionMembers.length).toBe(apiData.length);
    expect(institutionMembers[0].id).toBe(apiData[0].id);
    expect(institutionMembers[0].name).toBe(apiData[0].name);
    expect(institutionMembers[1].id).toBe(apiData[1].id);
    expect(institutionMembers[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Institution Member to API data', () => {
    const institutionMember = new InstitutionMember(1, 'Malik');
    const apiData = InstitutionMember.toApiData(institutionMember);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(institutionMember.id);
    expect(apiData.name).toBe(institutionMember.name);
  });

  it('should be able to convert Institution Member array to API data array', () => {
    const institutionMembers = [new InstitutionMember(1, 'Malik'), new InstitutionMember(2, 'Fauzan')];
    const apiData = InstitutionMember.toApiData(institutionMembers);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(institutionMembers.length);
    expect(apiData[0].id).toBe(institutionMembers[0].id);
    expect(apiData[0].name).toBe(institutionMembers[0].name);
    expect(apiData[1].id).toBe(institutionMembers[1].id);
    expect(apiData[1].name).toBe(institutionMembers[1].name);
  });
});
