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
  static async getAll(token, page = null, perPage = null) {
    const params = page && perPage ? { page, perPage } : {};
    const response = await api.get('/laporan-apbd', { token, ...params });
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
    return await api.post('/laporan-apbd', { body: ApbdReport.toApiData(data), token, file: { dokumen: file } });
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
    return await api.delete(`/laporan-apbd/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
