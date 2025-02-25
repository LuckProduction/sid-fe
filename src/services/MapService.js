import { Map } from '@/models';
import api from '@/utils/api';

export default class MapService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Map[];
   * }>}
   * */
  static async getAll(token, page = null, perPage = null) {
    const params = page && perPage ? { page, perPage } : {};
    const response = await api.get('/pemetaan', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Map.fromApiData(response.data) };
  }

  /**
   * @param {Map} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    const payload = {
      body: Map.toApiData(data),
      token
    };
    if (file) {
      payload.file = { konten: file };
    }
    return await api.post('/pemetaan', payload);
  }

  /**
   * @param {number} id
   * @param {Map} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    const payload = {
      body: Map.toApiData(data),
      token
    };
    if (file) {
      payload.file = { konten: file };
    }
    return await api.post(`/pemetaan/edit/${id}`, payload);
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
    return await api.delete(`/pemetaan/delete/${id}`, { token });
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
    return await api.delete(`/pemetaan/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
