import Model from '@/models/Model';
import Category, { IncomingApiData } from '@/models/Category';
import { describe, expect, it } from 'vitest';

describe('Category', () => {
  it('should be a valid model', () => {
    expect(Category).toBeDefined();
    expect(Category.prototype).toBeDefined();
    expect(Category.prototype.constructor).toBeDefined();
    expect(Category.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.category).toBe(Category);
  });

  it('should be able to create a new Category', () => {
    const category = new Category(1, 'Malik');

    expect(category).toBeDefined();
    expect(category.id).toBe(1);
    expect(category.name).toBe('Malik');
  });

  it('should be able to create a new Category from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const category = Category.fromApiData(apiData);

    expect(category).toBeDefined();
    expect(category.id).toBe(apiData.id);
    expect(category.name).toBe(apiData.name);
  });

  it('should be able to create a new Category array from API data array', () => {
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
    const categorys = Category.fromApiData(apiData);

    expect(categorys).toBeDefined();
    expect(categorys.length).toBe(apiData.length);
    expect(categorys[0].id).toBe(apiData[0].id);
    expect(categorys[0].name).toBe(apiData[0].name);
    expect(categorys[1].id).toBe(apiData[1].id);
    expect(categorys[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Category to API data', () => {
    const category = new Category(1, 'Malik');
    const apiData = Category.toApiData(category);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(category.id);
    expect(apiData.name).toBe(category.name);
  });

  it('should be able to convert Category array to API data array', () => {
    const categorys = [new Category(1, 'Malik'), new Category(2, 'Fauzan')];
    const apiData = Category.toApiData(categorys);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(categorys.length);
    expect(apiData[0].id).toBe(categorys[0].id);
    expect(apiData[0].name).toBe(categorys[0].name);
    expect(apiData[1].id).toBe(categorys[1].id);
    expect(apiData[1].name).toBe(categorys[1].name);
  });
});
