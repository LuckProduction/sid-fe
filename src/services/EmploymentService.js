import { Employment } from '@/models';
import api from '@/utils/api';

export default class EmploymentService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Employment[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/jabatan', { token });
    if (!response.data) return response;
    return { ...response, data: Employment.fromApiData(response.data) };
  }

  /**
   * @param {Employment} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/jabatan', { body: Employment.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Employment} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/jabatan/edit/${id}`, { body: Employment.toApiData(data), token });
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
    return await api.delete(`/jabatan/delete/${id}`, { token });
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
    return await api.delete(`/jabatan/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
