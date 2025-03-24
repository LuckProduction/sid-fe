/* eslint-disable no-unused-vars */
import api from '@/utils/api';

export default class InboxService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Inbox[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/dashboard/notifikasi', { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {Inbox} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async read(data, token) {
    return await api.post('/dashboard/notifikasi', { body: data, token });
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
  static async delete(token) {
    return await api.delete(`/dashboard/notifikasi`, { token });
  }

  // /**
  //  * @param {number[]} ids
  //  * @param {string} token
  //  * @returns {Promise<{
  //  *  code: HTTPStatusCode;
  //  *  status: boolean;
  //  *  message: string;
  //  * }>}
  //  */
  // static async deleteBatch(ids, token) {
  //   return await api.delete(`/inbox/multi-delete?id=${ids.join(',')}`, { token });
  // }
}
