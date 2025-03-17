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
  static async getAll({ token, page = null, per_page = null }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get('/atribut-surat', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: LetterAttribute.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: LetterAttribute[];
   * }>}
   * */
  static async getAllByType({ token, page = null, per_page = null, type_id }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/atribut-surat?jenis_surat_id=${type_id}`, { token, ...params });
    if (!response.data) return response;
    return { ...response, data: LetterAttribute.fromApiData(response.data) };
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
    return await api.post('/atribut-surat', { body: LetterAttribute.toApiData(data), token });
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
    return await api.post(`/atribut-surat/edit/${id}`, { body: LetterAttribute.toApiData(data), token });
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
    return await api.delete(`/atribut-surat/delete/${id}`, { token });
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
    return await api.delete(`/atribut-surat/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
