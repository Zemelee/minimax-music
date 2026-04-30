import axios from 'axios'

const API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || ''
const BASE_URL = 'https://api.minimaxi.com/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
})

// 音乐生成
export async function generateMusic({
  model = 'music-2.6', 
  prompt = '', 
  lyrics = '', 
  isInstrumental = false,
  lyricsOptimizer = false,
  outputFormat = 'url',
  audioSetting = {},
  aigc_watermark = false
}) {
  if (!API_KEY) {
    throw new Error('请配置 VITE_MINIMAX_API_KEY')
  }
  
  try {
    const response = await apiClient.post('/music_generation', {
      model,
      prompt,
      lyrics,
      is_instrumental: isInstrumental,
      lyrics_optimizer: lyricsOptimizer,
      output_format: outputFormat,
      audio_setting: Object.keys(audioSetting).length > 0 ? audioSetting : undefined,
      aigc_watermark
    })
    return response.data
  } catch (error) {
    if (error.response?.data?.base_resp?.status_msg) {
      throw new Error(error.response.data.base_resp.status_msg)
    }
    console.error('音乐生成失败:', error)
    throw error
  }
}

// 获取任务状态
export async function getTaskStatus(taskId) {
  try {
    const response = await apiClient.get(`/tasks/${taskId}`)
    return response.data
  } catch (error) {
    console.error('获取任务状态失败:', error)
    throw error
  }
}