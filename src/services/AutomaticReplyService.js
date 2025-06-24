/* eslint-disable no-unused-vars */
import { AutomaticReply } from '@/models';
import api from '@/utils/api';

export default class AutomaticReplyService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: AutomaticReply[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/balasan-otomatis', { token });
    if (!response.data) return response;
    return { ...response, data: AutomaticReply.fromApiData(response.data) };
  }

  /**
   * @param {AutomaticReply} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/balasan-otomatis', { body: AutomaticReply.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {AutomaticReply} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/balasan-otomatis/edit/${id}`, { body: AutomaticReply.toApiData(data), token });
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
    return await api.delete(`/balasan-otomatis/delete/${id}`, { token });
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
    return await api.delete(`/balasan-otomatis/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
