/**
 * 应用配置
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://sugarblack.top:8083';

export const config = {
  api: {
    baseURL: API_BASE,
    timeout: 30000,
  },
  app: {
    name: 'AI 音乐工坊',
    version: '1.0.0',
  },
};
