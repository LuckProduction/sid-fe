import { VillageInstitution } from '@/models';
import api from '@/utils/api';

export default class VillageInstitutionService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillageInstitution[];
   * }>}
   * */
  static async getAll(token, page = null, perPage = null) {
    const params = page && perPage ? { page, perPage } : {};
    const response = await api.get('/lembaga-desa', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: VillageInstitution.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: VillageInstitution[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/lembaga-desa/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: VillageInstitution.fromApiData(response.data) };
  }

  /**
   * @param {VillageInstitution} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/lembaga-desa', { body: VillageInstitution.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {VillageInstitution} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.post(`/lembaga-desa/edit/${id}`, { body: VillageInstitution.toApiData(data), token });
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
    return await api.delete(`/lembaga-desa/delete/${id}`, { token });
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
    return await api.delete(`/lembaga-desa/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
