import { Beneficiary } from '@/models';
import api from '@/utils/api';

export default class BeneficiaryService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Beneficiary[];
   * }>}
   * */
  static async getAll(token, id, page = null, per_page = null) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/peserta-bantuan?bantuan_id=${id}`, { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Beneficiary.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Beneficiary[];
   * }>}
   * */
  static async getById(token) {
    const response = await api.get('/peserta-bantuan', { token });
    if (!response.data) return response;
    return { ...response, data: Beneficiary.fromApiData(response.data) };
  }

  /**
   * @param {Beneficiary} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/peserta-bantuan', { body: Beneficiary.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Beneficiary} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/peserta-bantuan/edit/${id}`, { body: Beneficiary.toApiData(data), token });
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
    return await api.delete(`/peserta-bantuan/delete/${id}`, { token });
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
    return await api.delete(`/peserta-bantuan/multi-delete/?ids=${ids.join(',')}`, { token });
  }

  static async import(data, token, file) {
    return await api.post('/peserta-bantuan/import', { body: data, token, file: { file: file } });
  }
}
