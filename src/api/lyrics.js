import { createApiClient, handleApiError } from '../utils/api';
import { LYRICS_MODE } from '../constants';

/**
 * 歌词生成 API
 */

/**
 * 歌词生成（通过后端代理）
 * @param {Object} params - 生成参数
 * @param {string} params.mode - 生成模式：write_full_song | edit
 * @param {string} params.prompt - 主题/描述
 * @param {string} params.lyrics - 已有歌词（用于编辑模式）
 * @param {string} params.title - 歌曲标题
 * @returns {Promise<Object>}
 */
export async function generateLyrics({
  mode = LYRICS_MODE.WRITE_FULL_SONG,
  prompt = '',
  lyrics = '',
  title = '',
}) {
  const apiClient = createApiClient();

  try {
    const response = await apiClient.post('/music/lyrics', {
      mode,
      prompt,
      lyrics,
      title,
    });

    const data = response.data;
    // 后端直接返回 MiniMax 的响应，检查 status_code
    if (data.base_resp?.status_code !== 0) {
      throw new Error(data.base_resp?.status_msg || '歌词生成失败');
    }

    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * 获取歌词任务状态
 * @param {string} taskId - 任务 ID
 * @returns {Promise<Object>}
 */
export async function getLyricsTaskStatus(taskId) {
  const apiClient = createApiClient();
  try {
    const response = await apiClient.get(`/music/lyrics/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('获取歌词任务状态失败:', error);
    throw error;
  }
}
