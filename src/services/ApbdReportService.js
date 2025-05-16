/* eslint-disable no-unused-vars */
import { ApbdReport } from '@/models';
import api from '@/utils/api';

export default class ApbdReportService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ApbdReport[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/laporan-apbd', { token, params });
    if (!response.data) return response;
    return { ...response, data: ApbdReport.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ApbdReport[];
   * }>}
   * */
  static async getById(token, id) {
    const response = await api.get(`/laporan-apbd/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: ApbdReport.fromApiData(response.data) };
  }

  /**
   * @param {ApbdReport} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    const payload = {
      body: ApbdReport.toApiData(data),
      token
    };
    if (file) {
      payload.file = { dokumen: file };
    }
    return await api.post('/laporan-apbd', { ...payload });
  }

  /**
   * @param {number} id
   * @param {ApbdReport} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/laporan-apbd/edit/${id}`, { body: ApbdReport.toApiData(data), token, file: { dokumen: file } });
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
    return await api.delete(`/laporan-apbd/delete/${id}`, { token });
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
    return await api.delete(`/laporan-apbd/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
