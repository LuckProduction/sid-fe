import { Resident } from '@/models';
import api from '@/utils/api';

export default class ResidentService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Resident[];
   * }>}
   * */
  static async getAll({ token, page = null, per_page = null, search = null }) {
    const params = {};

    if (page && per_page) {
      params.page = page;
      params.per_page = per_page;
    }

    if (search) {
      params.search = search;
    }

    const response = await api.get('/master-penduduk', { token, params });

    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
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
    const response = await api.get(`/master-penduduk/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }

  /**
   * @param {Resident} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/master-penduduk', { body: Resident.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Resident} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/master-penduduk/edit/${id}`, { body: Resident.toApiData(data), token });
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
    return await api.delete(`/master-penduduk/delete/${id}`, { token });
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
    return await api.delete(`/master-penduduk/multi-delete/?ids=${ids.join(',')}`, { token });
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
  static async import(data, token, file) {
    return await api.post('/master-penduduk/import', { body: data, token, file: { file: file } });
  }

  static async export(token) {
    return await api.post('/master-penduduk/export', { token });
  }

  static async getFamily({ token, page = null, per_page = null }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get('/keluarga', { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }

  static async getFamilyDetail({ id, token, page = null, per_page = null }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/keluarga/${id}`, { token, ...params });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }
}
