import { Officer } from '@/models';
import api from '@/utils/api';

export default class OfficerService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Officer[];
   * }>}
   * */
  static async getAll(token, page = null, per_page = null) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get('/pengguna', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Officer.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Officer[];
   * }>}
   * */
  static async getAllPermision({ token, page = null, per_page = null, id }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/pengguna/permissions?id=${id}`, { token, ...params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {Officer} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/pengguna', { body: Officer.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Officer} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.post(`/pengguna/edit/${id}`, { body: Officer.toApiData(data), token });
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
    return await api.delete(`/pengguna/delete/${id}`, { token });
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
    return await api.delete(`/pengguna/multi-delete/?id=${ids.join(',')}`, { token });
  }

  static async changePassword(token, data) {
    return await api.post('/pengguna/ubah-password', { body: data, token });
  }
}
