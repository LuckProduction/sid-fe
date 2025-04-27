/* eslint-disable no-unused-vars */
import { LetterType, Resident, SubmitLetter } from '@/models';
import api from '@/utils/api';

export const kioskToken = import.meta.env.VITE_TOKEN_KIOSK;

export default class KioskService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Kiosk[];
   * }>}
   * */
  static async searchResident(data) {
    const response = await api.post('/anjungan/cari-penduduk', { body: data, token: kioskToken });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }

  static async getAllSubmitLetter({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/anjungan/riwayat-permohonan`, { params, token: kioskToken });
    if (!response.data) return response;
    return { ...response, data: SubmitLetter.fromApiData(response.data) };
  }

  static async getLetterTypeDetailWithoutDoc(id) {
    const response = await api.get(`/anjungan/jenis-surat/${id}`, { token: kioskToken });
    if (!response.data) return response;
    return { ...response, data: LetterType.fromApiData(response.data) };
  }

  static async storeCitizenReportReply(data) {
    return await api.post(`/anjungan/balas-pengaduan`, { body: data, token: kioskToken });
  }

  static async kioskBrowseReport({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/anjungan/riwayat-laporan`, { params, token: kioskToken });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async getDetailReport(id) {
    const response = await api.get(`/anjungan/detail-laporan/${id}`, { token: kioskToken });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async kioskBrowsePublicAssistance({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/anjungan/riwayat-bantuan`, { params, token: kioskToken });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async kioskBrowseTax({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/anjungan/riwayat-pajak`, { params, token: kioskToken });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }
}
