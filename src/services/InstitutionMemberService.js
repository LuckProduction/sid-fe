import { InstitutionMember } from '@/models';
import api from '@/utils/api';

export default class InstitutionMemberService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: InstitutionMember[];
   * }>}
   * */
  static async getAll({ token, lembaga, page = null, per_page = null }) {
    const params = page && per_page ? { page, per_page } : {};
    const response = await api.get(`/anggota-lembaga?lembaga_desa_id=${lembaga}`, { token, ...params });
    if (!response.data) return response;
    return { ...response, data: InstitutionMember.fromApiData(response.data) };
  }

  /**
   * @param {InstitutionMember} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/anggota-lembaga', { body: InstitutionMember.toApiData(data), token, file: { foto: file } });
  }

  /**
   * @param {number} id
   * @param {InstitutionMember} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/anggota-lembaga/edit/${id}`, { body: InstitutionMember.toApiData(data), token, file: { foto: file } });
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
    return await api.delete(`/anggota-lembaga/delete/${id}`, { token });
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
    return await api.delete(`/anggota-lembaga/multi-delete/?ids=${ids.join(',')}`, { token });
  }
}
