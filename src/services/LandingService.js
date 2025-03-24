/* eslint-disable no-unused-vars */
import { Article, LegalProducts, LetterType, Speech, SubmitLetter, VillageBoundaries, VillageEnterprise, VillageInstitution, VillageOfficials, VillagePotential, VillageProfile, VisiMisi } from '@/models';
import api from '@/utils/api';

export default class LandingService {
  static async getAllVisiMisi(page = 1, per_page = 10) {
    const response = await api.get('/landing/visi-misi', { page, per_page });
    if (!response.data) return response;
    return { ...response, data: VisiMisi.fromApiData(response.data) };
  }

  static async getAllArticle({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/landing/artikel`, { params });
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  static async getAllVillagePotential({ page = null, per_page = null, search }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/landing/potensi-desa?search=${search}`, { ...params });
    if (!response.data) return response;
    return { ...response, data: VillagePotential.fromApiData(response.data) };
  }

  static async getDetailArticle(slug) {
    const response = await api.get(`/landing/artikel/${slug}`);
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  static async getDetailVillagePotential(slug) {
    const response = await api.get(`/landing/potensi/${slug}`);
    if (!response.data) return response;
    return { ...response, data: VillagePotential.fromApiData(response.data) };
  }

  static async getSpeech(page = 1, per_page = 10) {
    const response = await api.get(`/landing/sambutan`, { page, per_page });
    if (!response.data) return response;
    return { ...response, data: Speech.fromApiData(response.data) };
  }

  static async getVillageProfile(page = 1, per_page = 10) {
    const response = await api.get(`/landing/profil-desa`, { page, per_page });
    if (!response.data) return response;
    return { ...response, data: VillageProfile.fromApiData(response.data) };
  }

  static async getAllInstitution(page = 1, per_page = 10) {
    const response = await api.get(`/landing/lembaga-desa`, { page, per_page });
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

  static async downloadLetter(token) {
    return await api.get(`/permohonan-surat/download/${token}`);
  }

  static async browseLetter(data) {
    return await api.post(`/permohonan-surat/cari-surat`, { body: data });
  }

  static async getAllLegalProducts(page = null, per_page = null) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/landing/produk-hukum`, { ...params });
    if (!response.data) return response;
    return { ...response, data: LegalProducts.fromApiData(response.data) };
  }

  static async getAllVillageBoundaries() {
    const response = await api.get(`/landing/batas-desa`);
    if (!response.data) return response;
    return { ...response, data: VillageBoundaries.fromApiData(response.data) };
  }

  static async getAllVillageOfficials() {
    const response = await api.get(`/landing/perangkat-desa`);
    if (!response.data) return response;
    return { ...response, data: VillageOfficials.fromApiData(response.data) };
  }

  static async beneficiaryCheck(data) {
    return await api.post(`/landing/cari-peserta-bantuan`, { body: data });
  }

  static async getAllEnterprise({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/landing/lapak`, { params });
    if (!response.data) return response;
    return { ...response, data: VillageEnterprise.fromApiData(response.data) };
  }

  static async getDetailEnterprise(slug) {
    const response = await api.get(`/landing/lapak/${slug}`);

    if (!response.data) return response;
    return { ...response, data: VillageEnterprise.fromApiData(response.data) };
  }

  static async likeLettering(id) {
    return await api.put(`/menu-lapak/suka/${id}`);
  }
}
