/* eslint-disable no-unused-vars */
import { CitizenReportReply } from '@/models';
import api from '@/utils/api';

export default class CitizenReportReplyService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: CitizenReportReply[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/balasan-pengaduan', { token, params });
    return { ...response, data: CitizenReportReply.fromApiData(response.data) };
  }

  /**
   * @param {CitizenReportReply} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/balasan-pengaduan', { body: CitizenReportReply.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {CitizenReportReply} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    const payload = {
      body: CitizenReportReply.toApiData(data),
      token,
      ...(file && { file: { dokumen: file } })
    };
    return await api.post(`/balasan-pengaduan/edit/${id}`, payload);
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
    return await api.delete(`/balasan-pengaduan/delete/${id}`, { token });
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
    return await api.delete(`/balasan-pengaduan/multi-delete?ids=${ids.join(',')}`, { token });
  }
}
