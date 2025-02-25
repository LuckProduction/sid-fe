import { Article, LegalProducts, LetterType, Speech, SubmitLetter, VillageInstitution, VillageProfile, VisiMisi } from '@/models';
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

  static async getResident(data) {
    return await api.post(`/landing/cari-penduduk`, { body: data });
  }

  static async getAllLetterType() {
    const response = await api.get(`/landing/jenis-surat`);
    if (!response.data) return response;
    return { ...response, data: LetterType.fromApiData(response.data) };
  }

  static async getLetterTypeDetail(id) {
    const response = await api.get(`/landing/jenis-surat/${id}`);
    if (!response.data) return response;
    return { ...response, data: LetterType.fromApiData(response.data) };
  }

  static async sumbitLetter(data) {
    return await api.post(`/permohonan-surat`, { body: SubmitLetter.toApiData(data) });
  }

  static async statusCheck(data) {
    return await api.post(`/permohonan-surat/cari-surat`, { body: data });
  }

  static async getAllLegalProducts(page = null, perPage = null) {
    const params = page && perPage ? { page, perPage } : {};
    const response = await api.get(`/landing/produk-hukum`, { ...params });
    if (!response.data) return response;
    return { ...response, data: LegalProducts.fromApiData(response.data) };
  }

  static async getAllResidentStatistic() {
    const response = await api.get(`/statistik/penduduk`);
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async getAllApbdtStatistic() {
    const response = await api.get(`/statistik/apbd`);
    if (!response.data) return response;
    return { ...response, data: response.data };
  }
}
