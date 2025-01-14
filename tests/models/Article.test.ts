import Model from '@/models/Model';
import Article, { IncomingApiData } from '@/models/Article';
import { describe, expect, it } from 'vitest';

describe('Article', () => {
  it('should be a valid model', () => {
    expect(Article).toBeDefined();
    expect(Article.prototype).toBeDefined();
    expect(Article.prototype.constructor).toBeDefined();
    expect(Article.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.article).toBe(Article);
  });

  it('should be able to create a new Article', () => {
    const article = new Article(1, 'Malik');

    expect(article).toBeDefined();
    expect(article.id).toBe(1);
    expect(article.name).toBe('Malik');
  });

  it('should be able to create a new Article from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const article = Article.fromApiData(apiData);

    expect(article).toBeDefined();
    expect(article.id).toBe(apiData.id);
    expect(article.name).toBe(apiData.name);
  });

  it('should be able to create a new Article array from API data array', () => {
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
    const articles = Article.fromApiData(apiData);

    expect(articles).toBeDefined();
    expect(articles.length).toBe(apiData.length);
    expect(articles[0].id).toBe(apiData[0].id);
    expect(articles[0].name).toBe(apiData[0].name);
    expect(articles[1].id).toBe(apiData[1].id);
    expect(articles[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Article to API data', () => {
    const article = new Article(1, 'Malik');
    const apiData = Article.toApiData(article);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(article.id);
    expect(apiData.name).toBe(article.name);
  });

  it('should be able to convert Article array to API data array', () => {
    const articles = [new Article(1, 'Malik'), new Article(2, 'Fauzan')];
    const apiData = Article.toApiData(articles);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(articles.length);
    expect(apiData[0].id).toBe(articles[0].id);
    expect(apiData[0].name).toBe(articles[0].name);
    expect(apiData[1].id).toBe(articles[1].id);
    expect(apiData[1].name).toBe(articles[1].name);
  });
});
