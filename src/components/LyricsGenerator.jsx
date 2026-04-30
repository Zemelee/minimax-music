import { useState } from 'react'
import { generateLyrics } from '../api/lyrics'

export default function LyricsGenerator({ onLyricsGenerated }) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generationStage, setGenerationStage] = useState(0)

  const stageText = ['正在发送请求...', 'AI 正在创作歌词...', '歌词生成完成!']

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setError(null)
    setGenerationStage(0)
    
    // 模拟进度阶段
    const stageInterval = setInterval(() => {
      setGenerationStage(prev => {
        if (prev < 2) return prev + 1
        clearInterval(stageInterval)
        return prev
      })
    }, 2000)

    try {
      const result = await generateLyrics({
        mode: 'write_full_song',
        prompt: prompt
      })
      clearInterval(stageInterval)
      setGenerationStage(2)
      
      if (result.base_resp?.status_code === 0) {
        onLyricsGenerated({
          title: result.song_title,
          styleTags: result.style_tags,
          lyrics: result.lyrics,
          prompt: prompt
        })
      } else {
        throw new Error(result.base_resp?.status_msg || '生成失败')
      }
      
      setPrompt('')
    } catch (err) {
      setError(err.message || '歌词生成失败，请重试')
      console.error(err)
    } finally {
      setIsGenerating(false)
      clearInterval(stageInterval)
    }
  }

  return (
    <div className="generator-card lyrics-generator">
      <div className="card-glow lyrics-glow"></div>
      
      <div className="card-header">
        <div className="icon-wrapper lyrics-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <h2>AI 歌词生成</h2>
        <p>输入主题或情感，让AI为你创作动人的歌词</p>
      </div>

      <div className="input-wrapper">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想要创作的歌词主题，例如：一首关于夏日海边的轻快情歌..."
          className="prompt-input"
          disabled={isGenerating}
          rows={4}
        />
        <div className="input-border-animation"></div>
      </div>

      {isGenerating && (
        <div className="generating-indicator">
          <div className="typing-animation">
            <span></span><span></span><span></span>
          </div>
          <span className="stage-text">{stageText[generationStage]}</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </div>
      )}

      <button 
        className="generate-btn lyrics-btn"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
      >
        <span className="btn-text">
          {isGenerating ? '创作中...' : '生成歌词'}
        </span>
        <span className="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            <path d="M2 2l7.586 7.586"/>
          </svg>
        </span>
        <div className="btn-particles"></div>
      </button>

      <div className="tips">
        <h4>💡 创作提示</h4>
        <ul>
          <li>描述歌词主题：爱情、梦想、成长、回忆等</li>
          <li>指定歌词风格：深情、欢快、励志、忧伤等</li>
          <li>描述情感基调：温暖、激昂、平静、悲伤等</li>
          <li>可以指定语言：中文、英文或中英混合</li>
        </ul>
      </div>
    </div>
  )
}