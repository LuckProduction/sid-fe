/* eslint-disable no-unused-vars */
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
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/layanan-mandiri', { token, params });
    if (!response.data) return response;
    return { ...response, data: Comunity.fromApiData(response.data) };
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
  static async update(id, data, token) {
    return await api.put(`/layanan-mandiri/edit/${id}`, { body: data, token });
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
  static async givePermission(id, token) {
    return await api.put(`/layanan-mandiri/tambah-permission/${id}`, { token });
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
    return await api.delete(`/layanan-mandiri/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
