import { Resident } from '@/models';
import api from '@/utils/api';

export default class ProspectiveVotersService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ProspectiveVoters[];
   * }>}
   * */
  static async getAll(token, page = null, perPage = null) {
    const params = page && perPage ? { page, perPage } : {};
    const response = await api.get('/calon-pemilih', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }
}
