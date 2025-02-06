import { Article, Speech, VillageInstitution, VillageProfile, VisiMisi } from '@/models';
import api from '@/utils/api';

export default class LandingService {
  static async getAllVisiMisi(page = 1, perPage = 10) {
    const response = await api.get('/landing/visi-misi', { page, perPage });
    if (!response.data) return response;
    return { ...response, data: VisiMisi.fromApiData(response.data) };
  }

  static async getAllArticle(page = 1, perPage = 10) {
    const response = await api.get('/landing/artikel', { page, perPage });
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  static async getDetailArticle(slug) {
    const response = await api.get(`/landing/artikel/${slug}`);
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  static async getSpeech(page = 1, perPage = 10) {
    const response = await api.get(`/landing/sambutan`, { page, perPage });
    if (!response.data) return response;
    return { ...response, data: Speech.fromApiData(response.data) };
  }

  static async getVillageProfile(page = 1, perPage = 10) {
    const response = await api.get(`/landing/profil-desa`, { page, perPage });
    if (!response.data) return response;
    return { ...response, data: VillageProfile.fromApiData(response.data) };
  }

  static async getAllInstitution(page = 1, perPage = 10) {
    const response = await api.get(`/landing/lembaga-desa`, { page, perPage });
    if (!response.data) return response;
    return { ...response, data: VillageInstitution.fromApiData(response.data) };
  }
}
