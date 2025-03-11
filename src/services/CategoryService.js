import { Category } from '@/models';
import api from '@/utils/api';

export default class CategoryService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Category[];
   * }>}
   * */
  static async getAll(token, page = null, per_page = null) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get('/kategori', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Category.fromApiData(response.data) };
  }

  /**
   * @param {Category} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/kategori', { body: Category.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Category} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/kategori/edit/${id}`, { body: Category.toApiData(data), token });
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
    return await api.delete(`/kategori/delete/${id}`, { token });
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
    return await api.delete(`/kategori/multi-delete/?ids=${ids.join(',')}`, { token });
  }

  static async getByType(token, type, page = 1, per_page = 10) {
    const response = await api.get(`/kategori?tipe=${type}`, { token, page, per_page });
    if (!response.data) return response;
    return { ...response, data: Category.fromApiData(response.data) };
  }
}
