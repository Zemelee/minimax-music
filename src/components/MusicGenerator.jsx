import { useState } from 'react'
import { generateMusic } from '../api/music'

export default function MusicGenerator({ onMusicGenerated }) {
  const [prompt, setPrompt] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [isInstrumental, setIsInstrumental] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generationStage, setGenerationStage] = useState(0)

  const stageText = ['正在发送请求...', 'AI 正在创作中...', '歌曲生成完成!']

  const handleGenerate = async () => {
    if (!prompt.trim() && !lyrics.trim()) return
    
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
      const result = await generateMusic({
        model: 'music-2.6',
        prompt: prompt,
        lyrics: lyrics,
        isInstrumental: isInstrumental,
        lyricsOptimizer: !lyrics.trim() && !isInstrumental,
        outputFormat: 'url'
      })
      clearInterval(stageInterval)
      setGenerationStage(2)
      
      if (result.data?.status === 2 && result.data.audio) {
        onMusicGenerated({
          url: result.data.audio,
          prompt: prompt,
          lyrics: lyrics
        })
      } else {
        throw new Error('生成失败，请重试')
      }
      
      setPrompt('')
      setLyrics('')
    } catch (err) {
      setError(err.message || '歌曲生成失败，请重试')
      console.error(err)
    } finally {
      setIsGenerating(false)
      clearInterval(stageInterval)
    }
  }

  return (
    <div className="generator-card music-generator">
      <div className="card-glow music-glow"></div>
      
      <div className="card-header">
        <div className="icon-wrapper music-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <h2>AI 歌曲创作</h2>
        <p>输入歌词和描述，让 AI 为你创作完整的歌曲</p>
      </div>

      <div className="input-wrapper">
        <label className="input-label">歌词（可选）</label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="输入歌词，每行一句，使用 \n 换行。例如：\n[Verse]\n阳光洒满海面\n海风轻轻吹过..."
          className="prompt-input"
          disabled={isGenerating}
          rows={6}
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">歌曲描述（必填）</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想要创作的音乐，例如：独立民谣,忧郁,内省,渴望,独自漫步,咖啡馆..."
          className="prompt-input"
          disabled={isGenerating}
          rows={3}
        />
      </div>

      <div className="options-row">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={isInstrumental}
            onChange={(e) => setIsInstrumental(e.target.checked)}
            disabled={isGenerating}
          />
          <span>生成纯音乐（无人声）</span>
        </label>
      </div>

      {isGenerating && (
        <div className="generating-indicator">
          <div className="music-bars">
            <span></span><span></span><span></span><span></span><span></span>
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
        className="generate-btn music-btn"
        onClick={handleGenerate}
        disabled={isGenerating || (!prompt.trim() && !isInstrumental)}
      >
        <span className="btn-text">
          {isGenerating ? '创作中...' : '生成歌曲'}
        </span>
        <span className="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </span>
        <div className="btn-particles"></div>
      </button>

      <div className="tips">
        <h4>💡 创作提示</h4>
        <ul>
          <li>描述音乐风格：流行、民谣、摇滚、电子、古典等</li>
          <li>描述情绪：欢快、忧郁、浪漫、激昂、平静等</li>
          <li>描述场景：咖啡馆、海边、夜晚、城市、乡村等</li>
          <li>歌词结构标签：[Verse], [Chorus], [Pre-Chorus], [Bridge], [Outro]</li>
        </ul>
      </div>
    </div>
  )
}