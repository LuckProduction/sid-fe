import { VisiMisi } from '@/models';
import api from '@/utils/api';

export default class VisiMisiService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VisiMisi[];
   * }>}
   * */
  static async getAll({ token, page = null, per_page = null }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/visi-misi`, { token, ...params });
    if (!response.data) return response;
    return { ...response, data: VisiMisi.fromApiData(response.data) };
  }

  /**
   * @param {VisiMisi} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/visi-misi', { body: VisiMisi.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {VisiMisi} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.post(`/visi-misi/edit/${id}`, { body: VisiMisi.toApiData(data), token });
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
    return await api.delete(`/visi-misi/delete/${id}`, { token });
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
    return await api.delete(`/visi-misi/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
