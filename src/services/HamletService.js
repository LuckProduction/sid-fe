/* eslint-disable no-unused-vars */
import { Hamlet } from '@/models';
import api from '@/utils/api';

export default class HamletService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Hamlet[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/dusun`, { token, params });
    if (!response.data) return response;
    return { ...response, data: Hamlet.fromApiData(response.data) };
  }

  /**
   * @param {Hamlet} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    const payload = {
      body: Hamlet.toApiData(data),
      token
    };
    if (file) {
      payload.file = { file_batas_dusun: file };
    }

    return await api.post('/dusun', { body: Hamlet.toApiData(data), token, file: { file_batas_dusun: file } });
  }

  /**
   * @param {number} id
   * @param {Hamlet} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/dusun/edit/${id}`, { body: Hamlet.toApiData(data), token, file: { file_batas_dusun: file } });
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
    return await api.delete(`/dusun/delete/${id}`, { token });
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
    return await api.delete(`/dusun/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
