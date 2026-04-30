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

// 歌词生成
// mode: write_full_song (写完整歌曲) | edit (编辑/续写歌词)
export async function generateLyrics({ 
  mode = 'write_full_song', 
  prompt = '', 
  lyrics = '', 
  title = '' 
}) {
  if (!API_KEY) {
    throw new Error('请先在 .env 文件中配置 VITE_MINIMAX_API_KEY')
  }
  
  try {
    const response = await apiClient.post('/lyrics_generation', {
      mode,
      prompt,
      lyrics,
      title
    })
    
    if (response.data.base_resp?.status_code !== 0) {
      throw new Error(response.data.base_resp?.status_msg || '歌词生成失败')
    }
    
    return response.data
  } catch (error) {
    if (error.response?.data?.base_resp?.status_msg) {
      throw new Error(error.response.data.base_resp.status_msg)
    }
    console.error('歌词生成失败:', error)
    throw error
  }
}

// 获取歌词任务状态
export async function getLyricsTaskStatus(taskId) {
  try {
    const response = await apiClient.get(`/lyrics/tasks/${taskId}`)
    return response.data
  } catch (error) {
    console.error('获取歌词任务状态失败:', error)
    throw error
  }
}