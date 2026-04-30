import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import MiniPlayer from '../components/MiniPlayer'

export default function Works({ works, onDelete }) {
  const [expandedLyrics, setExpandedLyrics] = useState({})
  const [playingMusicId, setPlayingMusicId] = useState(null)
  const [playingStates, setPlayingStates] = useState({})
  const [copyFeedback, setCopyFeedback] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null) // { type, id, name }
  const location = useLocation()

  // 处理从歌词生成页面的跳转，自动展开新生成的歌词
  useEffect(() => {
    if (location.state?.expandLyrics) {
      const lyricsId = location.state.expandLyrics
      setExpandedLyrics(prev => ({ ...prev, [lyricsId]: true }))
      // 清除 state 以避免重复处理
      window.history.replaceState(null, '')
    }
  }, [location.state])

  const toggleLyrics = (id) => {
    setExpandedLyrics(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadMusic = (work) => {
    if (work.url) {
      const link = document.createElement('a')
      link.href = work.url
      link.download = `ai-music-${work.id}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDeleteClick = (type, id, name) => {
    setDeleteTarget({ type, id, name })
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.type, deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="works-page">
      <div className="panel-header">
        <h2>📚 我的作品</h2>
        <p>已保存 {works.lyrics.length} 首歌词，{works.music.length} 首歌曲</p>
      </div>

      {works.music.length === 0 && works.lyrics.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎼</div>
          <h3>暂无作品</h3>
          <p>开始创作你的第一首歌曲或歌词吧！</p>
        </div>
      ) : (
        <div className="works-container">
          {/* 歌词作品 */}
          <div className="works-column">
            <h3 className="column-title">
              <span className="column-icon">🎤</span>
              歌词作品
              <span className="column-count">{works.lyrics.length}</span>
            </h3>
            <div className="works-list">
              {works.lyrics.length === 0 ? (
                <div className="empty-column">暂无歌词作品</div>
              ) : (
                works.lyrics.map(work => (
                  <div key={work.id} className="work-card lyrics-card">
                    <div className="work-header">
                      <div className="work-info">
                        <h4>{work.title || '歌词作品'}</h4>
                        <span className="work-date">{formatDate(work.createdAt)}</span>
                      </div>
                      <div className="work-actions">
                        <button 
                          className="copy-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(work.lyrics).then(() => {
                              setCopyFeedback(work.id)
                              setTimeout(() => setCopyFeedback(null), 2000)
                            })
                          }}
                          title="复制歌词"
                        >
                          {copyFeedback === work.id ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                          )}
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClick('lyrics', work.id, work.title || '歌词作品')}
                          title="删除"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {work.styleTags && (
                      <div className="work-tags">
                        {work.styleTags.split(',').slice(0, 4).map((tag, i) => (
                          <span key={i} className="work-tag">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                    
                    <button 
                      className="expand-btn"
                      onClick={() => toggleLyrics(work.id)}
                    >
                      <span>{expandedLyrics[work.id] ? '收起' : '展开'}</span>
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className={`expand-icon ${expandedLyrics[work.id] ? 'expanded' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    
                    {expandedLyrics[work.id] && (
                      <div className="work-lyrics">
                        <pre>{work.lyrics}</pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 歌曲作品 */}
          <div className="works-column">
            <h3 className="column-title">
              <span className="column-icon">🎵</span>
              歌曲作品
              <span className="column-count">{works.music.length}</span>
            </h3>
            <div className="works-list">
              {works.music.length === 0 ? (
                <div className="empty-column">暂无歌曲作品</div>
              ) : (
                works.music.map(work => (
                  <div key={work.id} className="work-card music-card">
                    <div className="work-header">
                      <div className="work-info">
                        <h4>{work.prompt?.slice(0, 40) || '歌曲作品'}{work.prompt?.length > 40 ? '...' : ''}</h4>
                        <span className="work-date">{formatDate(work.createdAt)}</span>
                      </div>
                      <div className="work-actions">
                        {work.url && (
                          <button 
                            className="download-btn"
                            onClick={() => downloadMusic(work)}
                            title="下载歌曲（URL有效期24小时）"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                          </button>
                        )}
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClick('music', work.id, work.prompt?.slice(0, 20) || '歌曲作品')}
                          title="删除"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="work-meta">
                      <span className="meta-tag">模型: {work.model || 'music-2.6'}</span>
                      {work.lyrics && <span className="meta-tag">有歌词</span>}
                    </div>
                    
                    {playingMusicId === work.id ? (
                      <MiniPlayer 
                        audioUrl={work.url}
                        isPlaying={playingStates[work.id] || false}
                        onClose={() => {
                          setPlayingMusicId(null)
                          setPlayingStates(prev => ({ ...prev, [work.id]: false }))
                        }}
                      />
                    ) : (
                      work.url && (
                        <button 
                          className="play-btn"
                          onClick={() => {
                            setPlayingMusicId(work.id)
                            setPlayingStates(prev => ({ ...prev, [work.id]: true }))
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          播放
                        </button>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h3>确认删除</h3>
            <p>确定要删除「{deleteTarget.name}」吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteTarget(null)}>取消</button>
              <button className="modal-confirm" onClick={confirmDelete}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}