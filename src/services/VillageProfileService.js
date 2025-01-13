import { VillageProfile } from '@/models';
import api from '@/utils/api';

export default class VillageProfileService {
  /**
   * @param {{
   * token: string,
   * page?: number,
   * perPage?: number
   * }} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillageProfile[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/profil-desa', { token });
    if (!response.data) return response;
    return { ...response, data: VillageProfile.fromApiData(response.data) };
  }
}
