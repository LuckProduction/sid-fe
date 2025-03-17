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
  static async getAll(token, type_id) {
    const response = await api.get(`/template-jenis-surat?jenis_surat_id=${type_id}`, { token });
    if (!response.data) return response;
    return { ...response, data: LetterTemplate.fromApiData(response.data) };
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
    return await api.post('/template-jenis-surat', { body: LetterTemplate.toApiData(data), token });
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
    return await api.patch(`/template-jenis-surat/edit/${id}`, { body: LetterTemplate.toApiData(data), token });
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
    return await api.delete(`/template-jenis-surat/delete/${id}`, { token });
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
    return await api.delete(`/template-jenis-surat/multi-delete?id=${ids.join(',')}`, { token });
  }
}
