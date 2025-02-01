import { Article, Speech, VisiMisi } from '@/models';
import api from '@/utils/api';

export default class LandingService {
  static async getAllVisiMisi() {
    const response = await api.get('/landing/visi-misi');
    if (!response.data) return response;
    return { ...response, data: VisiMisi.fromApiData(response.data) };
  }

  static async getAllArticle() {
    const response = await api.get('/landing/artikel');
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  static async getDetailArticle(slug) {
    const response = await api.get(`/landing/artikel/${slug}`);
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  static async getSpeech() {
    const response = await api.get(`/landing/sambutan`);
    if (!response.data) return response;
    return { ...response, data: Speech.fromApiData(response.data) };
  }
}
