import { createApiClient, handleApiError } from '../utils/api';

/**
 * 音乐生成 API
 */

/**
 * 音乐生成（通过后端代理）
 * @param {Object} params - 生成参数
 * @param {string} params.model - 模型版本
 * @param {string} params.prompt - 歌曲描述
 * @param {string} params.lyrics - 歌词
 * @param {boolean} params.isInstrumental - 是否纯音乐
 * @param {boolean} params.lyricsOptimizer - 是否优化歌词
 * @param {string} params.outputFormat - 输出格式
 * @param {Object} params.audioSetting - 音频设置
 * @param {boolean} params.aigc_watermark - 是否添加 AI 水印
 * @returns {Promise<Object>}
 */
export async function generateMusic({
  model = 'music-2.6',
  prompt = '',
  lyrics = '',
  isInstrumental = false,
  lyricsOptimizer = false,
  outputFormat = 'url',
  audioSetting = {},
  aigc_watermark = false,
}) {
  const apiClient = createApiClient();

  try {
    const response = await apiClient.post('/music/generate', {
      model,
      prompt,
      lyrics,
      is_instrumental: isInstrumental,
      lyrics_optimizer: lyricsOptimizer,
      output_format: outputFormat,
      audio_setting: Object.keys(audioSetting).length > 0 ? audioSetting : undefined,
      aigc_watermark,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * 获取任务状态
 * @param {string} taskId - 任务 ID
 * @returns {Promise<Object>}
 */
export async function getTaskStatus(taskId) {
  const apiClient = createApiClient();
  try {
    const response = await apiClient.get(`/music/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('获取任务状态失败:', error);
    throw error;
  }
}
