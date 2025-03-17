/* eslint-disable no-unused-vars */
import { VillagePotential } from '@/models';
import api from '@/utils/api';

export default class VillagePotentialService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillagePotential[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/potensi-desa', { token, params });
    if (!response.data) return response;
    return { ...response, data: VillagePotential.fromApiData(response.data) };
  }

  /**
   * @param {VillagePotential} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/potensi-desa', { body: VillagePotential.toApiData(data), token, file: { foto: file } });
  }

  /**
   * @param {number} id
   * @param {VillagePotential} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/potensi-desa/edit/${id}`, { body: VillagePotential.toApiData(data), token, file: { foto: file } });
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
    return await api.delete(`/potensi-desa/delete/${id}`, { token });
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
    return await api.delete(`/potensi-desa/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
