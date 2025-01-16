import { Article } from '@/models';
import api from '@/utils/api';

export default class ArticleService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Article[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/artikel', { token });
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Article[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/artikel/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: Article.fromApiData(response.data) };
  }

  /**
   * @param {Article} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/artikel', { body: Article.toApiData(data), token, file: { gambar: file } });
  }

  /**
   * @param {number} id
   * @param {Article} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.put(`/artikel/edit/${id}`, { body: Article.toApiData(data), token, file: { gambar: file } });
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
    return await api.delete(`/artikel/delete/${id}`, { token });
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
    return await api.delete(`/artikel/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
