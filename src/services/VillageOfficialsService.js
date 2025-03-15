/* eslint-disable no-unused-vars */
import { VillageOfficials } from '@/models';
import api from '@/utils/api';

export default class VillageOfficialsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillageOfficials[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/perangkat-desa', { token, params });
    if (!response.data) return response;
    return { ...response, data: VillageOfficials.fromApiData(response.data) };
  }

  /**
   * @param {VillageOfficials} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/perangkat-desa', { body: VillageOfficials.toApiData(data), token, file: { foto: file } });
  }

  /**
   * @param {number} id
   * @param {VillageOfficials} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/perangkat-desa/edit/${id}`, { body: VillageOfficials.toApiData(data), token, file: { foto: file } });
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
    return await api.delete(`/perangkat-desa/delete/${id}`, { token });
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
    return await api.delete(`/perangkat-desa/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
