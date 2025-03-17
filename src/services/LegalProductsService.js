/* eslint-disable no-unused-vars */
import { LegalProducts } from '@/models';
import api from '@/utils/api';

export default class LegalProductsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: LegalProducts[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/produk-hukum', { token, params });
    if (!response.data) return response;
    return { ...response, data: LegalProducts.fromApiData(response.data) };
  }

  /**
   * @param {LegalProducts} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/produk-hukum', { body: LegalProducts.toApiData(data), token, file: { dokumen: file } });
  }

  /**
   * @param {number} id
   * @param {LegalProducts} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/produk-hukum/edit/${id}`, { body: LegalProducts.toApiData(data), token, file: { dokumen: file } });
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
    return await api.delete(`/produk-hukum/delete/${id}`, { token });
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
    return await api.delete(`/produk-hukum/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
