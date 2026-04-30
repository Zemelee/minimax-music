import { useState, useRef, useEffect } from 'react'
import { generateMusic } from '../api/music'

const SAMPLE_RATE_OPTIONS = [
  { value: 44100, label: '44100 Hz' },
  { value: 32000, label: '32000 Hz' },
  { value: 24000, label: '24000 Hz' },
  { value: 16000, label: '16000 Hz' },
]

const BITRATE_OPTIONS = [
  { value: 256000, label: '256 kbps' },
  { value: 128000, label: '128 kbps' },
  { value: 64000, label: '64 kbps' },
  { value: 32000, label: '32 kbps' },
]

// 示例提示词
const EXAMPLE_PROMPTS = [
  {
    prompt: '流行音乐,明快旋律,阳光夏日至潮,海边日落,青春洋溢,轻快吉他',
    lyrics: `[Verse]\n阳光洒在海面上\n浪花轻轻拍打着岸边\n微风拂过脸庞\n心情像鸟儿飞翔\n\n[Chorus]\n这个夏天如此美好\n让我们尽情欢笑\n手牵手一起奔跑\n在这温暖的阳光下`,
    isInstrumental: false,
    lyricsOptimizer: false,
  },
  {
    prompt: '校园青春，活力无限制！',
    lyrics: `[Intro]

[Verse]
单车后座的风吹过
载着我们懵懂的梦
操场上的笑声还记得
阳光洒满了每个角落
课桌上刻下的名字
谁还记得当初的样子
书包里塞满的憧憬
在毕业季渐渐远去

[Pre-Chorus]
那年夏天蝉鸣不停
告别的话却说不清
未来像远方的风景
闪耀却又看不清

[Chorus]
校门口的夏天 故事还没讲完
多少次想回头 看你站在栏杆
青春是一场盛宴 散场却太匆忙
梦想的翅膀 就要飞向远方

[Post-Chorus]
飞向远方
别再回望

[Verse]
毕业照上的笑脸
定格了青涩的容颜
一张张熟悉的脸
说好不哭却红了眼
散伙饭的酒杯碰响
举杯敬过往的时光
未来的路还很长
我们各自奔赴远方

[Pre-Chorus]
那年夏天蝉鸣不停
告别的话却说不清
未来像远方的风景
闪耀却又看不清

[Chorus]
校门口的夏天 故事还没讲完
多少次想回头 看你站在栏杆
青春是一场盛宴 散场却太匆忙
梦想的翅膀 就要飞向远方

[Bridge]
也许我们会怀念
那段无忧无虑的年
也许我们会遗憾
没说出口的喜欢
但别让眼泪模糊了视线
前方的路需要勇敢

[Verse]
多年以后再回首
会想起谁又会想起我
操场上是否还有歌
在风中轻轻地诉说
那些成长的烦恼
那些青涩的骄傲
都将化作最美的符号
在记忆深处永不老

[Chorus]
校门口的夏天 故事还没讲完
多少次想回头 看你站在栏杆
青春是一场盛宴 散场却太匆忙
梦想的翅膀 就要飞向远方

[Post-Chorus]
飞向远方
别再回望

[Outro]`,
    isInstrumental: false,
    lyricsOptimizer: true,
  },
  {
    prompt: '电子音乐,赛博朋克,未来城市,霓虹灯光,科技感,节奏强烈',
    lyrics: '',
    isInstrumental: false,
    lyricsOptimizer: true,
  },
  {
    prompt: '古典钢琴,忧伤钢琴曲,深夜独处,回忆往事,眼泪,静谧美',
    lyrics: '',
    isInstrumental: true,
    lyricsOptimizer: false,
  },
  {
    prompt: '摇滚风格,热血沸腾,追逐梦想,不羁青春,吉他嘶吼,live现场',
    lyrics: `[Verse]\n冲破黑夜的阻挡\n不再迷失方向\n心中燃烧的火焰\n照亮前行的路\n\n[Chorus]\n我们无所畏惧\n一起大声歌唱\n这是我们的时代\n让梦想展翅飞翔`,
    isInstrumental: false,
    lyricsOptimizer: false,
  },
]

export default function MusicGenerator({ onMusicGenerated, prefillLyrics, onClearPrefillLyrics }) {
  const [prompt, setPrompt] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [isInstrumental, setIsInstrumental] = useState(false)
  const [lyricsOptimizer, setLyricsOptimizer] = useState(false)
  const [sampleRate, setSampleRate] = useState(44100)
  const [bitrate, setBitrate] = useState(256000)
  const [addWatermark, setAddWatermark] = useState(false)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generationStage, setGenerationStage] = useState(0)
  const [validationErrors, setValidationErrors] = useState({})

  // 处理预填充的歌词（从歌词生成页面跳转过来）
  useEffect(() => {
    if (prefillLyrics) {
      setLyrics(prefillLyrics.lyrics || '')
      // 如果有标题或风格标签，可以自动填充到 prompt 中
      if (prefillLyrics.title) {
        setPrompt(prefillLyrics.title)
      }
      // 清除预填充状态
      if (onClearPrefillLyrics) {
        onClearPrefillLyrics()
      }
    }
  }, [prefillLyrics])

  const stageText = ['正在发送请求...', 'AI 正在创作中，请耐心等待...', '歌曲生成完成!']

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
    setLyrics(example.lyrics)
    setIsInstrumental(example.isInstrumental)
    setLyricsOptimizer(example.lyricsOptimizer)
    setValidationErrors({})
  }

  const validateForm = () => {
    const errors = {}
    
    if (!isInstrumental && !lyrics.trim() && !lyricsOptimizer) {
      errors.lyrics = '请输入歌词，或勾选"自动生成歌词"'
    }
    
    if (!prompt.trim()) {
      errors.prompt = '请输入歌曲描述'
    } else if (prompt.trim().length < 2) {
      errors.prompt = '歌曲描述至少需要2个字符'
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
      const result = await generateMusic({
        model: 'music-2.6',
        prompt: prompt.trim(),
        lyrics: lyrics.trim(),
        isInstrumental,
        lyricsOptimizer: lyricsOptimizer && !lyrics.trim(),
        outputFormat: 'url',
        audioSetting: {
          sample_rate: sampleRate,
          bitrate,
          format: 'mp3'
        },
        aigc_watermark: addWatermark
      })
      clearInterval(stageInterval)
      setGenerationStage(2)
      
      if (result.data?.status === 2 && result.data.audio) {
        onMusicGenerated({
          url: result.data.audio,
          prompt: prompt.trim(),
          lyrics: lyrics.trim(),
          model: 'music-2.6',
          createdAt: new Date().toISOString()
        })
        // 清空表单
        setPrompt('')
        setLyrics('')
      } else {
        throw new Error('生成失败，请重试')
      }
    } catch (err) {
      setError(err.message || '歌曲生成失败，请重试')
      console.error(err)
    } finally {
      setIsGenerating(false)
      clearInterval(stageInterval)
    }
  }

  const isFormValid = () => {
    return (isInstrumental || lyrics.trim() || lyricsOptimizer) && prompt.trim().length >= 2
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

      <button
        className="random-btn"
        onClick={fillRandomExample}
        disabled={isGenerating}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        随机示例
      </button>

      <div className="input-wrapper">
        <label className="input-label">
          歌词 
          {!isInstrumental && !lyricsOptimizer && <span className="required">*</span>}
          <span className="input-hint">（非必填，如不填请勾选"自动生成歌词"）</span>
        </label>
        <textarea
          value={lyrics}
          onChange={(e) => {
            setLyrics(e.target.value)
            setValidationErrors(prev => ({ ...prev, lyrics: '' }))
          }}
          placeholder={`输入歌词，每行一句。例如：\n[Verse]\n街灯微亮晚风轻抚\n影子拉长独自漫步\n[Pre-Chorus]\n不知去向渴望何处`}
          className={`prompt-input ${validationErrors.lyrics ? 'error' : ''}`}
          disabled={isGenerating}
          rows={6}
        />
        {validationErrors.lyrics && <span className="field-error">{validationErrors.lyrics}</span>}
      </div>

      <div className="input-wrapper">
        <label className="input-label">
          歌曲描述 <span className="required">*</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            setValidationErrors(prev => ({ ...prev, prompt: '' }))
          }}
          placeholder="描述你想要创作的音乐，例如：独立民谣,忧郁,内省,渴望,独自漫步,咖啡馆..."
          className={`prompt-input ${validationErrors.prompt ? 'error' : ''}`}
          disabled={isGenerating}
          rows={2}
        />
        {validationErrors.prompt && <span className="field-error">{validationErrors.prompt}</span>}
      </div>

      <div className="options-grid">
        <div className="option-item">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={isInstrumental}
              onChange={(e) => {
                setIsInstrumental(e.target.checked)
                setValidationErrors(prev => ({ ...prev, lyrics: '' }))
              }}
              disabled={isGenerating}
            />
            <span>生成纯音乐（无人声）</span>
          </label>
        </div>
        <div className="option-item">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={lyricsOptimizer}
              onChange={(e) => {
                setLyricsOptimizer(e.target.checked)
                setValidationErrors(prev => ({ ...prev, lyrics: '' }))
              }}
              disabled={isGenerating}
            />
            <span>自动生成歌词</span>
          </label>
        </div>
        <div className="option-item">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={addWatermark}
              onChange={(e) => setAddWatermark(e.target.checked)}
              disabled={isGenerating}
            />
            <span>添加水印</span>
          </label>
        </div>
      </div>

      <details className="advanced-options">
        <summary>高级设置</summary>
        <div className="advanced-content">
          <div className="select-row">
            <div className="select-item">
              <label>
                采样率
                <span>音频每秒采样次数，值越高音质越好，文件也越大</span>
              </label>
              <select 
                value={sampleRate} 
                onChange={(e) => setSampleRate(Number(e.target.value))}
                disabled={isGenerating}
              >
                {SAMPLE_RATE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="select-item">
              <label>
                比特率
                <span>音频数据压缩比率，值越高音质越好，文件也越大</span>
              </label>
              <select 
                value={bitrate} 
                onChange={(e) => setBitrate(Number(e.target.value))}
                disabled={isGenerating}
              >
                {BITRATE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </details>

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
        disabled={isGenerating || !isFormValid()}
      >
        <span className="btn-text">
          {isGenerating ? '创作中，请耐心等待...' : '生成歌曲'}
        </span>
        <span className="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </span>
        <div className="btn-particles"></div>
      </button>

      <div className="tips">
        <h4>💡 歌词结构说明</h4>
        <div className="tips-grid">
          <div className="tip-item">
            <strong>[Intro]</strong>
            <span>前奏 - 歌曲开场的instrumental段落，用于引入情绪和节奏</span>
          </div>
          <div className="tip-item">
            <strong>[Verse]</strong>
            <span>主歌 - 叙述歌曲故事的主体部分，讲述歌词内容</span>
          </div>
          <div className="tip-item">
            <strong>[Pre-Chorus]</strong>
            <span>预副歌 - 进入副歌前的过渡段，制造期待感</span>
          </div>
          <div className="tip-item">
            <strong>[Chorus]</strong>
            <span>副歌 - 歌曲高潮部分，旋律最抓耳，通常重复演唱</span>
          </div>
          <div className="tip-item">
            <strong>[Bridge]</strong>
            <span>桥段 - 提供对比和变化，打破重复，增加层次感</span>
          </div>
          <div className="tip-item">
            <strong>[Outro]</strong>
            <span>尾声 - 歌曲结尾的处理，渐弱消失或强调主题</span>
          </div>
        </div>
        <div className="tips-style">
          <h5>🎵 创作风格建议</h5>
          <ul>
            <li>风格：流行、民谣、摇滚、电子、古典、爵士、说唱等</li>
            <li>情绪：欢快、忧郁、浪漫、激昂、平静、温暖等</li>
            <li>场景：咖啡馆、海边、夜晚、城市、乡村、旅行等</li>
            <li>描述越详细，AI 生成的音乐越符合你的预期</li>
          </ul>
        </div>
      </div>
    </div>
  )
}