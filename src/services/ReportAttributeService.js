/* eslint-disable no-unused-vars */
import { ReportAttribute } from '@/models';
import api from '@/utils/api';

export default class ReportAttributeService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ReportAttribute[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/atribut-master-laporan', { token, params });
    if (!response.data) return response;
    return { ...response, data: ReportAttribute.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ReportAttribute[];
   * }>}
   * */
  static async getByReport({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/atribut-master-laporan', { token, params });
    if (!response.data) return response;
    return { ...response, data: ReportAttribute.fromApiData(response.data) };
  }

  /**
   * @param {ReportAttribute} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/atribut-master-laporan', { body: ReportAttribute.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {ReportAttribute} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/atribut-master-laporan/edit/${id}`, { body: ReportAttribute.toApiData(data), token });
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
    return await api.delete(`/atribut-master-laporan/delete/${id}`, { token });
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
    return await api.delete(`/atribut-master-laporan/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
