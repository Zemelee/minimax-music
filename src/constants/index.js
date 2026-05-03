/**
 * 应用常量定义
 */

// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'music_token',
  USER: 'music_user',
  WORKS: 'ai_music_studio_works',
};

// API 响应状态码
export const API_STATUS = {
  SUCCESS: 200,
  ERROR: 500,
};

// MiniMax API 状态码
export const MINIMAX_STATUS = {
  SUCCESS: 0,
};

// 生成类型
export const GENERATION_TYPE = {
  LYRICS: 'lyrics',
  MUSIC: 'music',
};

// 歌词生成模式
export const LYRICS_MODE = {
  WRITE_FULL_SONG: 'write_full_song',
  EDIT: 'edit',
};

// 音乐模型版本
export const MUSIC_MODEL = {
  DEFAULT: 'music-2.6',
};

// 输出格式
export const OUTPUT_FORMAT = {
  URL: 'url',
};

// 路由路径
export const ROUTES = {
  HOME: '/',
  LYRICS: '/lyrics',
  MUSIC: '/music',
  WORKS: '/works',
  HELP: '/help',
  LOGIN: '/login',
};
