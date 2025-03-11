import { ApbdItem } from '@/models';
import api from '@/utils/api';

export default class ApbdItemService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ApbdItem[];
   * }>}
   * */
  static async getAll(token, laporan, page = null, per_page = null) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/item-apbd?laporan_apbd_id=${laporan}`, { token, ...params });
    if (!response.data) return response;
    return { ...response, data: ApbdItem.fromApiData(response.data) };
  }

  /**
   * @param {ApbdItem} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/item-apbd', { body: ApbdItem.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {ApbdItem} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/item-apbd/edit/${id}`, { body: ApbdItem.toApiData(data), token });
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
    return await api.delete(`/item-apbd/delete/${id}`, { token });
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
    return await api.delete(`/item-apbd/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
