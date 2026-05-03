import axios from 'axios';
import { STORAGE_KEYS, MINIMAX_STATUS } from '../constants';
import { config } from '../config';

/**
 * 创建 API 客户端实例
 * @param {string} token - 认证令牌
 * @returns {import('axios').AxiosInstance}
 */
function createApiClient(token = null) {
  const authToken = token || localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  const client = axios.create({
    baseURL: config.api.baseURL,
    timeout: config.api.timeout,
    headers: {
      'Authorization': authToken || '',
      'Content-Type': 'application/json',
    },
  });

  // 响应拦截器：处理 401 自动登出
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // 清除本地登录状态
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        // 触发自定义事件，通知 AuthContext 登出
        window.dispatchEvent(new CustomEvent('music-auth-expired'));
      }
      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * 处理 API 响应错误
 * @param {Error} error - 错误对象
 * @throws {Error}
 */
function handleApiError(error) {
  if (error.response?.data?.msg) {
    throw new Error(error.response.data.msg);
  }
  if (error.response?.data?.base_resp?.status_msg) {
    throw new Error(error.response.data.base_resp.status_msg);
  }
  console.error('API 请求失败:', error);
  throw error;
}

export { createApiClient, handleApiError };
