import { LetterTemplate } from '@/models';
import api from '@/utils/api';

export default class LetterTemplateService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: LetterTemplate[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/letter-template', {token});
    if(!response.data) return response;
    return { ...response, data: LetterTemplate.fromApiData(response.data)};
  }

  /**
   * @param {LetterTemplate} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/letter-template', { body: LetterTemplate.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {LetterTemplate} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/letter-template/edit/${id}`, { body: LetterTemplate.toApiData(data), token });
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
    return await api.delete(`/letter-template/delete/${id}`, { token });
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
    return await api.delete(`/letter-template/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
