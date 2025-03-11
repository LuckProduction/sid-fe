import { LetterType } from '@/models';
import api from '@/utils/api';

export default class LetterTypeService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: LetterType[];
   * }>}
   * */
  static async getAll(token, page = null, per_page = null) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get('/jenis-surat', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: LetterType.fromApiData(response.data) };
  }

  /**
   * @param {LetterType} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/jenis-surat', { body: LetterType.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {LetterType} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.post(`/jenis-surat/edit/${id}`, { body: LetterType.toApiData(data), token });
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
    return await api.delete(`/jenis-surat/delete/${id}`, { token });
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
    return await api.delete(`/jenis-surat/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
