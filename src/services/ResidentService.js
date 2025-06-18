/* eslint-disable no-unused-vars */
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
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
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
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Article[];
   * }>}
   * */
  static async getAllAnomali({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/master-penduduk/deteksi-anomali`, { token, params });
    if (!response.data) return response;
    return { ...response, data: response.data };
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
  static async updateWithImage(id, data, token, file) {
    return await api.post(`/master-penduduk/edit/${id}`, { body: Resident.toApiData(data), token, file: { foto: file } });
  }

  static async update(id, data, token) {
    return await api.put(`/master-penduduk/edit/${id}`, { body: Resident.toApiData(data), token });
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
    return await api.delete(`/master-penduduk/multi-delete?ids=${ids.join(',')}`, { token });
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

  static async getFamily({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/keluarga', { token, params });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }

  static async getFamilyDetail(id, token) {
    const response = await api.get(`/keluarga/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ProspectiveVoters[];
   * }>}
   * */
  static async getProspectiveVoter({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get(`/calon-pemilih`, { token, params });
    if (!response.data) return response;
    return { ...response, data: Resident.fromApiData(response.data) };
  }
}
