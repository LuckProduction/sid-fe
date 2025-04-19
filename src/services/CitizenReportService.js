/* eslint-disable no-unused-vars */
import { CitizenReport, CitizenReportReply } from '@/models';
import api from '@/utils/api';

export default class CitizenReportService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: CitizenReport[];
   * }>}
   * */
  static async getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/layanan-pengaduan', { token, params });
    console.log(response);

    if (!response.data) return response;
    return { ...response, data: CitizenReport.fromApiData(response.data) };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: CitizenReport[];
   * }>}
   * */
  static async getById(id, token) {
    const response = await api.get(`/layanan-pengaduan/${id}`, { token });

    if (!response.data) return response;
    return { ...response, data: CitizenReport.fromApiData(response.data) };
  }

  /**
   * @param {CitizenReport} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/layanan-pengaduan', { body: CitizenReport.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {CitizenReport} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/layanan-pengaduan/edit/${id}`, { body: CitizenReport.toApiData(data), token });
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
    return await api.delete(`/layanan-pengaduan/delete/${id}`, { token });
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
    return await api.delete(`/layanan-pengaduan/multi-delete?ids=${ids.join(',')}`, { token });
  }

  /**
   * @param {CitizenReport} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async verification(id, data, token) {
    return await api.post(`/layanan-pengaduan/verifikasi/${id}`, { body: data, token });
  }

  /**
   * @param {CitizenReport} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async reply(data, token, file) {
    const payload = {
      body: CitizenReportReply.toApiData(data),
      token,
      ...(file && { file: { dokumen: file } })
    };
    return await api.post(`/balasan-pengaduan`, payload);
  }
}
