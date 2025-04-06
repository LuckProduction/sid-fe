/* eslint-disable no-unused-vars */
import { TaxPeriod } from '@/models';
import api from '@/utils/api';

export default class TaxPeriodService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: TaxPeriod[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/periode-pajak', { token, params });
    if (!response.data) return response;
    return { ...response, data: TaxPeriod.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: PublicTax[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/periode-pajak/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: TaxPeriod.fromApiData(response.data) };
  }

  /**
   * @param {TaxPeriod} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/periode-pajak', { body: TaxPeriod.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {TaxPeriod} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/periode-pajak/edit/${id}`, { body: TaxPeriod.toApiData(data), token });
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
    return await api.delete(`/periode-pajak/delete/${id}`, { token });
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
    return await api.delete(`/periode-pajak/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
