/* eslint-disable no-unused-vars */
import { WebSettings } from '@/models';
import api from '@/utils/api';
import { kioskToken } from './KioskService';

export default class WebSettingsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: WebSettings[];
   * }>}
   * */
  static async getAll({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== ''));
    const response = await api.get('/pengaturan', { params, token: kioskToken });
    console.log(response);
    if (!response.data) return response;
    return { ...response, data: WebSettings.fromApiData(response.data) };
  }

  /**
   * @param {WebSettings} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.put('/pengaturan', { body: WebSettings.toApiData(data), token });
  }
}
