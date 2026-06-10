import axios, { type AxiosInstance } from 'axios';
import { API_CONFIG } from '../constants';

/**
 * Base HTTP client over one configured axios instance. The response interceptor
 * unwraps `data`; failures reject with the native AxiosError. Domain services
 * extend this and call the protected verbs.
 */
export class ApiClient {
  private readonly http: AxiosInstance;

  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.http = axios.create({
      baseURL,
      headers: { 'Content-Type': API_CONFIG.CONTENT_TYPE },
      timeout: API_CONFIG.TIMEOUT,
    });
    this.http.interceptors.response.use((response) => response.data);
  }

  protected post<T>(url: string, data?: unknown): Promise<T> {
    return this.http.post<T, T>(url, data);
  }
}
