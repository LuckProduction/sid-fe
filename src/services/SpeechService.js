import { Speech } from '@/models';
import api from '@/utils/api';

export default class SpeechService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Speech[];
   * }>}
   * */
  static async getAll(token) {
    const response = await api.get('/sambutan', {token});
    if(!response.data) return response;
    return { ...response, data: Speech.fromApiData(response.data)};
  }

  /**
   * @param {Speech} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async update(data, token) {
    return await api.post('/sambutan', { body: Speech.toApiData(data), token });
  }

 
}
