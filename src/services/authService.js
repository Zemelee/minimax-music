import axios from 'axios';
import { STORAGE_KEYS } from '../constants';
import { config } from '../config';

/**
 * 认证服务
 */

/**
 * 登录
 * @param {string} account - 账号
 * @param {string} password - 密码
 * @returns {Promise<{token: string, uid: string, account: string}>}
 */
export async function login(account, password) {
  const response = await axios.post(`${config.api.baseURL}/music/login`, {
    account,
    password,
  });
  
  const result = response.data;
  if (result.code === 200) {
    const { token, uid, account: userAccount } = result.data;
    return { token, uid, account: userAccount };
  } else {
    throw new Error(result.msg || '登录失败');
  }
}

/**
 * 获取余额
 * @param {string} token - 认证令牌
 * @returns {Promise<number>}
 */
export async function getBalance(token) {
  const response = await axios.get(`${config.api.baseURL}/music/balance`, {
    headers: { Authorization: token },
  });
  
  const result = response.data;
  if (result.code === 200) {
    return result.data.balance;
  }
  throw new Error('获取余额失败');
}

/**
 * 保存登录状态
 * @param {string} token - 令牌
 * @param {Object} user - 用户信息
 */
export function saveAuthState(token, user) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

/**
 * 清除登录状态
 */
export function clearAuthState() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * 获取保存的登录状态
 * @returns {{token: string|null, user: Object|null}}
 */
export function getSavedAuthState() {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}
