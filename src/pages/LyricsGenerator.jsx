import { useState, useRef } from 'react'
import { generateLyrics } from '../api/lyrics'

// 示例提示词
const EXAMPLE_PROMPTS = [
  {
    prompt: `【创作主题】青春校园
【核心主题】青春、梦想、校园生活
【情感基调】充满活力、怀旧温情、积极向上、略带忧伤但不失希望
【目标受众】即将毕业或刚毕业的学生`,
    title: '青春校园'
  },
  {
    prompt: '失恋后的心情，回忆过去的美好时光',
    title: '再见青春'
  },
  {
    prompt: '夜晚独自散步，城市的灯光和内心的孤独',
    title: '夜行者'
  },
  {
    prompt: '描绘春天悄然到来的治愈喜悦，草木萌芽、万物复苏、微风暖阳、花开遍野的鲜活画面，怀揣新生期许、温柔希望、人间美好的氛围感，适合抒情治愈风流行歌词，意象清新温柔、词句细腻有诗意',
    title: ''
  },
  {
    prompt: '友情的力量，朋友之间相互支持',
    title: '朋友'
  },
]

export default function LyricsGenerator({ onLyricsGenerated, onCreateMusicWithLyrics }) {
  const [mode, setMode] = useState('write_full_song')
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generationStage, setGenerationStage] = useState(0)
  const [validationErrors, setValidationErrors] = useState({})
  const [generatedLyrics, setGeneratedLyrics] = useState(null)

  const stageText = ['正在发送请求...', 'AI 正在创作歌词...', '歌词生成完成!']

  // 记录上一次填充的示例索引，避免连续重复
  const lastExampleIndex = useRef(-1)

  // 随机填充示例
  const fillRandomExample = () => {
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * EXAMPLE_PROMPTS.length)
    } while (randomIndex === lastExampleIndex.current && EXAMPLE_PROMPTS.length > 1)
    lastExampleIndex.current = randomIndex
    
    const example = EXAMPLE_PROMPTS[randomIndex]
    setPrompt(example.prompt)
    setTitle(example.title)
    setValidationErrors({})
  }

  const validateForm = () => {
    const errors = {}

    if (!prompt.trim()) {
      errors.prompt = '请输入歌词主题或描述'
    } else if (prompt.trim().length < 2) {
      errors.prompt = '歌词主题至少需要2个字符'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGenerate = async () => {
    if (!validateForm()) return

    setIsGenerating(true)
    setError(null)
    setGenerationStage(0)
    setValidationErrors({})

    const stageInterval = setInterval(() => {
      setGenerationStage(prev => {
        if (prev < 2) return prev + 1
        clearInterval(stageInterval)
        return prev
      })
    }, 2000)

    try {
      const result = await generateLyrics({
        mode,
        prompt: prompt.trim(),
        title: title.trim()
      })
      clearInterval(stageInterval)
      setGenerationStage(2)

      if (result.base_resp?.status_code === 0) {
        const lyricsData = {
          title: result.song_title,
          styleTags: result.style_tags,
          lyrics: result.lyrics,
          prompt: prompt.trim()
        }
        setGeneratedLyrics(lyricsData)
        onLyricsGenerated(lyricsData)
        // 清空表单
        setPrompt('')
        setTitle('')
      } else {
        throw new Error(result.base_resp?.status_msg || '生成失败')
      }
    } catch (err) {
      setError(err.message || '歌词生成失败，请重试')
      console.error(err)
    } finally {
      setIsGenerating(false)
      clearInterval(stageInterval)
    }
  }

  const isFormValid = () => {
    return prompt.trim().length >= 2
  }

  return (
    <div className="generator-card lyrics-generator">
      <div className="card-glow lyrics-glow"></div>

      <div className="card-header">
        <div className="icon-wrapper lyrics-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
        <h2>AI 歌词生成</h2>
        <p>输入主题或情感，让 AI 为你创作动人的歌词</p>
      </div>

      <button
        className="random-btn lyrics-random-btn"
        onClick={fillRandomExample}
        disabled={isGenerating}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        随机示例
      </button>

      <div className="mode-selector">
        <label className={`mode-option ${mode === 'write_full_song' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="mode"
            value="write_full_song"
            checked={mode === 'write_full_song'}
            onChange={(e) => setMode(e.target.value)}
          />
          <span>写完整歌曲</span>
        </label>
        <label className={`mode-option ${mode === 'edit' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="mode"
            value="edit"
            checked={mode === 'edit'}
            onChange={(e) => setMode(e.target.value)}
          />
          <span>编辑/续写歌词</span>
        </label>
      </div>

      <div className="input-wrapper">
        <label className="input-label">
          歌曲标题 <span className="input-hint">（可选）</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入歌曲标题，生成后将保持此标题"
          className="text-input"
          disabled={isGenerating}
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">
          歌词主题/描述 <span className="required">*</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            setValidationErrors(prev => ({ ...prev, prompt: '' }))
          }}
          placeholder={mode === 'write_full_song'
            ? "描述你想要创作的歌词主题，例如：一首关于夏日海边的轻快情歌，浪漫而温暖，阳光、沙滩、海浪..."
            : "输入现有歌词内容进行编辑或续写..."
          }
          className={`prompt-input ${validationErrors.prompt ? 'error' : ''}`}
          disabled={isGenerating}
          rows={5}
        />
        {validationErrors.prompt && <span className="field-error">{validationErrors.prompt}</span>}
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </div>
      )}

      {generatedLyrics && !isGenerating && (
        <div className="success-message">
          <div className="success-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>歌词生成成功！</span>
          </div>
          <div className="success-preview">
            <div className="preview-title">{generatedLyrics.title || '无标题'}</div>
            <div className="preview-lyrics">{generatedLyrics.lyrics?.slice(0, 100)}...</div>
          </div>
          <div className="success-actions">
            <button 
              className="create-music-btn"
              onClick={() => {
                if (onCreateMusicWithLyrics) {
                  onCreateMusicWithLyrics(generatedLyrics)
                }
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
              立即创作歌曲
            </button>
            <button 
              className="dismiss-btn"
              onClick={() => setGeneratedLyrics(null)}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <button
        className="generate-btn lyrics-btn"
        onClick={handleGenerate}
        disabled={isGenerating || !isFormValid()}
      >
        <span className="btn-text">
          {isGenerating ? '创作中...' : '生成歌词'}
        </span>
        <span className="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
          </svg>
        </span>
        <div className="btn-particles"></div>
      </button>

      <div className="tips">
        <h4>💡 创作技巧</h4>
        <div className="tips-grid">
          <div className="tip-item">
            <strong>🎯 主题描述</strong>
            <span>爱情、亲情、友情、梦想、成长、乡愁、校园、职场等</span>
          </div>
          <div className="tip-item">
            <strong>🎭 情感基调</strong>
            <span>欢快愉悦、深情浪漫、忧郁伤感、励志热血、平静治愈、愤怒呐喊等</span>
          </div>
          <div className="tip-item">
            <strong>🎨 歌词风格</strong>
            <span>诗意文艺、口语直白、文艺小清新、故事叙事、古风雅致等</span>
          </div>
          <div className="tip-item">
            <strong>🌍 语言选择</strong>
            <span>纯中文、中英混合、粤语歌词等，中英混合更有国际范儿</span>
          </div>
        </div>
        <div className="tips-example">
          <h5>📝 示例描述</h5>
          <ul>
            <li>"一首关于毕业季的青春歌曲，略带伤感但充满希望"</li>
            <li>"写给异地恋人的深情告白，情歌风格，中英混合"</li>
            <li>"描述都市夜归人的孤独与坚持，说唱风格"</li>
          </ul>
        </div>
      </div>
    </div>
  )
}