import { PublicAssistance } from '@/models';
import api from '@/utils/api';

export default class PublicAssistanceService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: PublicAssistance[];
   * }>}
   * */
  static async getAll(token, page = null, per_page = null) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get('/bantuan', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: PublicAssistance.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: PublicAssistance[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/bantuan/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: PublicAssistance.fromApiData(response.data) };
  }

  /**
   * @param {PublicAssistance} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/bantuan', { body: PublicAssistance.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {PublicAssistance} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/bantuan/edit/${id}`, { body: PublicAssistance.toApiData(data), token });
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
    return await api.delete(`/bantuan/delete/${id}`, { token });
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
    return await api.delete(`/bantuan/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
