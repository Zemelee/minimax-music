import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://sugarblack.top:8083'

// 创建带 token 的 axios 实例
function createApiClient() {
  const token = localStorage.getItem('music_token')
  const client = axios.create({
    baseURL: API_BASE,
    headers: {
      'Authorization': token || '',
      'Content-Type': 'application/json'
    }
  })

  // 响应拦截器：处理 401 自动登出
  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // 清除本地登录状态
        localStorage.removeItem('music_token')
        localStorage.removeItem('music_user')
        // 触发自定义事件，通知 AuthContext 登出
        window.dispatchEvent(new CustomEvent('music-auth-expired'))
      }
      return Promise.reject(error)
    }
  )

  return client
}

// 音乐生成（通过后端代理）
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
  const apiClient = createApiClient()
  
  try {
    const response = await apiClient.post('/music/generate', {
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
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg)
    }
    if (error.response?.data?.base_resp?.status_msg) {
      throw new Error(error.response.data.base_resp.status_msg)
    }
    console.error('音乐生成失败:', error)
    throw error
  }
}

// 获取任务状态（通过后端代理）
export async function getTaskStatus(taskId) {
  const apiClient = createApiClient()
  try {
    const response = await apiClient.get(`/music/tasks/${taskId}`)
    return response.data
  } catch (error) {
    console.error('获取任务状态失败:', error)
    throw error
  }
}
