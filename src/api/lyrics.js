import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8083'

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
        localStorage.removeItem('music_token')
        localStorage.removeItem('music_user')
        window.dispatchEvent(new CustomEvent('music-auth-expired'))
      }
      return Promise.reject(error)
    }
  )

  return client
}

// 歌词生成（通过后端代理）
// mode: write_full_song (写完整歌曲) | edit (编辑/续写歌词)
export async function generateLyrics({ 
  mode = 'write_full_song', 
  prompt = '', 
  lyrics = '', 
  title = '' 
}) {
  const apiClient = createApiClient()
  
  try {
    const response = await apiClient.post('/music/lyrics', {
      mode,
      prompt,
      lyrics,
      title
    })
    
    const data = response.data
    // 后端直接返回 MiniMax 的响应，检查 status_code
    if (data.base_resp?.status_code !== 0) {
      throw new Error(data.base_resp?.status_msg || '歌词生成失败')
    }
    
    return data
  } catch (error) {
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg)
    }
    if (error.response?.data?.base_resp?.status_msg) {
      throw new Error(error.response.data.base_resp.status_msg)
    }
    console.error('歌词生成失败:', error)
    throw error
  }
}

// 获取歌词任务状态（通过后端代理）
export async function getLyricsTaskStatus(taskId) {
  const apiClient = createApiClient()
  try {
    const response = await apiClient.get(`/music/lyrics/tasks/${taskId}`)
    return response.data
  } catch (error) {
    console.error('获取歌词任务状态失败:', error)
    throw error
  }
}
