import { VillageBoundaries } from '@/models';
import api from '@/utils/api';

export default class VillageBoundariesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillageBoundaries[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/batas-desa', { token });
    if (!response.data) return response;
    return { ...response, data: VillageBoundaries.fromApiData(response.data) };
  }
  /**
   * @param {VillageBoundaries} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async update(data, token, file) {
    return await api.post('/batas-desa', { body: VillageBoundaries.toApiData(data), token, file: { file_batas_desa: file } });
  }


}
