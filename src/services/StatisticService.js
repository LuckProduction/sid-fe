import api from '@/utils/api';

export default class StatisticService {
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

  static async getAllOverview(token) {
    const response = await api.get(`/dashboard`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async getAllPublicAssistanceStatistic() {
    const response = await api.get(`/statistik/bantuan`);
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  static async getAllViewers(token) {
    const response = await api.get(`/pengunjung`, { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }
}
