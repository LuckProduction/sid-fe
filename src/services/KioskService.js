import { Resident } from '@/models';
import api from '@/utils/api';

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
    const response = await api.post('/anjungan/cari-penduduk', { body: data });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }
}
