/* eslint-disable no-unused-vars */
import { VillageEnterprise } from '@/models';
import api from '@/utils/api';

export default class VillageEnterpriseService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillageEnterprise[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/lapak', { token, params });
    if (!response.data) return response;
    return { ...response, data: VillageEnterprise.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillageEnterprise[];
   * }>}
   * */
  static async getById({ token, id }) {
    const response = await api.get(`/lapak/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: VillageEnterprise.fromApiData(response.data) };
  }

  /**
   * @param {VillageEnterprise} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/lapak', { body: VillageEnterprise.toApiData(data), token, file: { foto: file } });
  }

  /**
   * @param {number} id
   * @param {VillageEnterprise} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/lapak/edit/${id}`, { body: VillageEnterprise.toApiData(data), token, file: { foto: file } });
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
    return await api.delete(`/lapak/delete/${id}`, { token });
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
    return await api.delete(`/lapak/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
