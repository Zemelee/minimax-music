import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GenerationProvider, useGeneration } from './context/GenerationContext'
import LyricsGenerator from './pages/LyricsGenerator'
import MusicGenerator from './pages/MusicGenerator'
import Works from './pages/Works'
import Login from './pages/Login'
import Help from './pages/Help'

const STORAGE_KEY = 'ai_music_studio_works'

function Navigation({ works }) {
  const location = useLocation() // 导航信息
  const { user, logout, balance } = useAuth()
  const { isGenerating, generationType } = useGeneration()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    if (isGenerating) return
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    logout()
  }

  // 生成中点击导航时的提示
  const handleNavClick = (e, path) => {
    if (isGenerating && location.pathname !== path) {
      e.preventDefault()
    }
  }
  
  return (
    <>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1>AI 音乐工坊</h1>
            <p>MiniMax Music Studio</p>
          </div>
        </div>
        
        <nav className="nav">
          <Link 
            to="/lyrics" 
            className={`nav-link ${isActive('/lyrics') ? 'active' : ''} ${isGenerating && !isActive('/lyrics') ? 'nav-disabled' : ''}`}
            onClick={(e) => handleNavClick(e, '/lyrics')}
          >
            歌词创作
          </Link>
          <Link 
            to="/music" 
            className={`nav-link ${isActive('/music') ? 'active' : ''} ${isGenerating && !isActive('/music') ? 'nav-disabled' : ''}`}
            onClick={(e) => handleNavClick(e, '/music')}
          >
            歌曲创作
          </Link>
          <Link 
            to="/works" 
            className={`nav-link ${isActive('/works') ? 'active' : ''} ${isGenerating && !isActive('/works') ? 'nav-disabled' : ''}`}
            onClick={(e) => handleNavClick(e, '/works')}
          >
            我的作品
          </Link>
          <Link 
            to="/help" 
            className={`nav-link ${isActive('/help') ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, '/help')}
          >
            使用说明
          </Link>
        </nav>

        <div className="header-actions">
          <div className="works-count">
            <span className="count-badge">{works.lyrics.length}</span>
            <span className="count-label">歌词</span>
            <span className="count-badge">{works.music.length}</span>
            <span className="count-label">歌曲</span>
          </div>
          {user && (
            <div className="user-info">
              <span className="user-balance" title="当前余额">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v12M6 12h12"/>
                </svg>
                {balance !== null ? balance : '-'}
              </span>
              <span className="user-account">{user.account}</span>
              <button 
                className={`logout-btn ${isGenerating ? 'logout-disabled' : ''}`} 
                onClick={handleLogout} 
                title={isGenerating ? '生成中无法退出' : '退出登录'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 生成中的提示横幅 */}
      {isGenerating && (
        <div className="generation-banner">
          <div className="generation-banner-content">
            <div className="generation-spinner"></div>
            <span>
              {generationType === 'music' ? '🎵 歌曲生成中，请勿切换页面...' : '🎤 歌词生成中，请勿切换页面...'}
            </span>
          </div>
        </div>
      )}

      {/* 退出确认弹窗 */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h3>确认退出</h3>
            <p>退出后需要重新登录才能继续创作</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowLogoutConfirm(false)}>取消</button>
              <button className="modal-confirm" onClick={confirmLogout}>确认退出</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function AppContent() {
  const { user, loading, refreshBalance } = useAuth()
  const location = useLocation() // route
  const navigate = useNavigate() // router
  const [works, setWorks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { music: [], lyrics: [] }
  })
  const [prefillLyrics, setPrefillLyrics] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
  }, [works])

  // 未登录时显示登录页面
  if (loading) {
    return (
      <div className="app">
        <div className="bg-animation">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
          <div className="grid-bg"></div>
        </div>
        <div className="loading-screen">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  // 处理从歌词生成页面跳转创作歌曲
  const handleCreateMusicWithLyrics = (lyricsData) => {
    setPrefillLyrics(lyricsData)
    navigate('/music')
  }

  // 清除预填充歌词
  const clearPrefillLyrics = () => {
    setPrefillLyrics(null)
  }

  const handleMusicGenerated = (musicData) => {
    const newWork = {
      id: Date.now(),
      ...musicData
    }
    setWorks(prev => ({
      ...prev,
      music: [newWork, ...prev.music].slice(0, 50)
    }))
    // 生成成功后刷新余额（通过 balanceVersion 触发）
    refreshBalance()
  }

  const handleLyricsGenerated = (lyricsData) => {
    const newId = Date.now()
    const newWork = {
      id: newId,
      ...lyricsData
    }
    setWorks(prev => ({
      ...prev,
      lyrics: [newWork, ...prev.lyrics].slice(0, 50)
    }))
    // 生成成功后刷新余额
    refreshBalance()
    // 跳转到作品页面并展开新歌词
    navigate('/works', { state: { expandLyrics: newId } })
  }

  const deleteWork = (type, id) => {
    setWorks(prev => ({
      ...prev,
      [type]: prev[type].filter(w => w.id !== id)
    }))
  }

  const showFeatures = location.pathname === '/help'

  return (
    <div className="app">
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        <div className="grid-bg"></div>
      </div>

      <Navigation works={works} />

      <main className="main-content">
        <Routes>

          <Route path="/lyrics" element={
            <section className="panel-section">
              <div className="panel-header">
                <h2>🎤 AI 歌词生成</h2>
                <p>输入主题或情感，让 AI 为你创作动人的歌词</p>
              </div>
              <LyricsGenerator 
                onLyricsGenerated={handleLyricsGenerated}
                onCreateMusicWithLyrics={handleCreateMusicWithLyrics}
              />
            </section>
          } />


          <Route path="/music" element={
            <section className="panel-section">
              <div className="panel-header">
                <h2>🎵 AI 歌曲创作</h2>
                <p>输入歌词和描述，让 AI 为你创作完整的歌曲</p>
              </div>
              <MusicGenerator 
                onMusicGenerated={handleMusicGenerated}
                prefillLyrics={prefillLyrics}
                onClearPrefillLyrics={clearPrefillLyrics}
              />
            </section>
          } />


          <Route path="/works" element={
            <Works works={works} onDelete={deleteWork} />
          } />


          <Route path="/help" element={<Help />} />
          
          <Route path="/" element={
            <section className="panel-section">
              <div className="panel-header">
                <h2>🎤 AI 歌词生成</h2>
                <p>输入主题或情感，让 AI 为你创作动人的歌词</p>
              </div>
              <LyricsGenerator 
                onLyricsGenerated={handleLyricsGenerated}
                onCreateMusicWithLyrics={handleCreateMusicWithLyrics}
              />
            </section>
          } />
        </Routes>

        {showFeatures && (
          <section className="features-section">
            <h3 className="section-title">为什么选择我们</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h4>快速生成</h4>
                <p>先进的 AI 模型，几秒钟内即可生成高质量音乐</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
                <h4>歌词创作</h4>
                <p>智能歌词生成，支持多种风格和语言</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <h4>一键下载</h4>
                <p>作品自动保存，可随时下载分享</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </div>
                <h4>易于使用</h4>
                <p>简洁直观的界面，无需专业音乐知识</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 AI 音乐工坊 ·  MiniMax 驱动</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GenerationProvider>
          <AppContent />
        </GenerationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
