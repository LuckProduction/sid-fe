import { Comunity } from '@/models';
import api from '@/utils/api';

export default class ComunityService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Comunity[];
   * }>}
   * */
  static async getAll({ token, page = null, per_page = null }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get('/layanan-mandiri', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Comunity.fromApiData(response.data) };
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(id, token) {
    return await api.delete(`/layanan-mandiri/delete/${id}`, { token });
  }

  /**
   * @param {number[]} ids
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/layanan-mandiri/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
