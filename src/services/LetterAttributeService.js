import { LetterAttribute } from '@/models';
import api from '@/utils/api';

export default class LetterAttributeService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: LetterAttribute[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/letter-attribute', {token});
    if(!response.data) return response;
    return { ...response, data: LetterAttribute.fromApiData(response.data)};
  }

  /**
   * @param {LetterAttribute} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/letter-attribute', { body: LetterAttribute.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {LetterAttribute} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/letter-attribute/edit/${id}`, { body: LetterAttribute.toApiData(data), token });
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
    return await api.delete(`/letter-attribute/delete/${id}`, { token });
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
    return await api.delete(`/letter-attribute/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
