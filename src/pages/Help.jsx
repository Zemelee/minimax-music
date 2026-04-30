import { Link } from 'react-router-dom'

export default function Help() {
  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="help-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h1>AI 音乐工坊</h1>
        <p className="help-subtitle">MiniMax Music Studio</p>
        <p className="help-desc">
          这是 <a href="http://q11e.cn" target="_blank" rel="noopener noreferrer">q11e.cn</a> 的娱乐性AI音乐创作平台
        </p>
      </div>

      <div className="help-card">
        <h2>💡 使用说明</h2>
        
        <div className="help-section">
          <h3>额度说明</h3>
          <div className="info-box highlight">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M6 12h12"/>
              </svg>
            </div>
            <div className="info-content">
              <p><strong>每次生成消耗 7 额度</strong></p>
              <p>无论是歌词创作还是歌曲创作，每次都会扣除 7 额度</p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="info-content">
              <p><strong>每日免费领取 7 额度</strong></p>
              <p>每天可以在 <a href="http://q11e.cn" target="_blank" rel="noopener noreferrer">q11e.cn</a> 领取额度</p>
            </div>
          </div>
        </div>

        <div className="help-section">
          <h3>功能介绍</h3>
          
          <div className="feature-item">
            <div className="feature-icon lyrics">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <div className="feature-content">
              <h4>🎤 歌词创作</h4>
              <p>输入主题或情感描述，AI 将为你创作完整的歌词。支持多种风格，包括青春校园、抒情浪漫、说唱等。</p>
              <div className="feature-example">
                <span className="example-label">示例歌词格式：</span>
                <pre className="example-code">{`[Intro]

[Verse]
操场上的风轻拂过脸庞
课桌上刻满了旧时光
那时的我们笑得那么张扬
以为明天就到远方

[Pre-Chorus]
...
[Chorus]
...
[Outro]`}</pre>
              </div>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon music">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <div className="feature-content">
              <h4>🎵 歌曲创作</h4>
              <p>可以输入自己创作的歌词，或使用 AI 生成的歌词，AI 将为你创作完整的歌曲音频。</p>
              <p className="tip">💡 提示：先在「歌词创作」中生成歌词，然后点击「立即创作歌曲」可直接跳转</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon works">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="feature-content">
              <h4>📁 我的作品</h4>
              <p>所有生成的作品都会保存在「我的作品」中，包括歌词和歌曲，可以随时查看和播放。</p>
            </div>
          </div>
        </div>

        <div className="help-section">
          <h3>使用流程</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>登录账户</h4>
                <p>使用 q11e 账户登录（邮箱 + 密码）</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>领取额度</h4>
                <p>每天在 q11e.cn 领取 7 额度</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>创作歌词</h4>
                <p>输入主题，让 AI 为你创作歌词</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>生成歌曲</h4>
                <p>使用歌词创作完整歌曲</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h4>保存作品</h4>
                <p>在「我的作品」中查看和播放</p>
              </div>
            </div>
          </div>
        </div>

        <div className="help-section">
          <h3>相关链接</h3>
          <div className="links-grid">
            <a href="http://q11e.cn" target="_blank" rel="noopener noreferrer" className="link-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              <span>q11e.cn 主页</span>
            </a>
            <Link to="/lyrics" className="link-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
              <span>开始创作歌词</span>
            </Link>
            <Link to="/music" className="link-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
              </svg>
              <span>开始创作歌曲</span>
            </Link>
            <Link to="/works" className="link-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span>查看我的作品</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="help-card disclaimer">
        <h3>⚠️ 免责声明</h3>
        <p>本平台仅供娱乐使用。生成的音乐内容版权归生成者所有。AI 生成的内容可能存在不确定性，请谨慎使用。</p>
      </div>
    </div>
  )
}