/* eslint-disable no-unused-vars */
import { SubmitLetter } from '@/models';
import api from '@/utils/api';

export default class SubmitLetterService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: SubmitLetter[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/permohonan-surat', { token, params });
    if (!response.data) return response;
    return { ...response, data: SubmitLetter.fromApiData(response.data) };
  }

  /**
   * @param {SubmitLetter} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/permohonan-surat', { body: SubmitLetter.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {SubmitLetter} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.post(`/permohonan-surat/edit/${id}`, { body: SubmitLetter.toApiData(data), token });
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
    return await api.delete(`/permohonan-surat/delete/${id}`, { token });
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
    return await api.delete(`/permohonan-surat/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
