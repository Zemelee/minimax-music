import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGeneration } from '../context/GenerationContext'

export default function Layout({ children }) {
  const location = useLocation()
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

  const handleNavClick = (e, path) => {
    if (isGenerating && location.pathname !== path) {
      e.preventDefault()
    }
  }
  
  return (
    <div className="app">
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        <div className="grid-bg"></div>
      </div>

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
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''} ${isGenerating && !isActive('/') ? 'nav-disabled' : ''}`}
            onClick={(e) => handleNavClick(e, '/')}
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

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>© 2024 AI 音乐工坊 ·  MiniMax 驱动</p>
      </footer>
    </div>
  )
}