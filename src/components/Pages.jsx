import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LyricsGenerator from '../pages/LyricsGenerator'
import MusicGenerator from '../pages/MusicGenerator'
import Works from '../pages/Works'
import Help from '../pages/Help'

const STORAGE_KEY = 'ai_music_studio_works'

// 首页
export function HomePage() {
  const { refreshBalance } = useAuth()
  const navigate = useNavigate()
  
  const handleLyricsGenerated = (lyricsData) => {
    const newId = Date.now()
    const newWork = { id: newId, ...lyricsData }
    const saved = localStorage.getItem(STORAGE_KEY)
    const works = saved ? JSON.parse(saved) : { music: [], lyrics: [] }
    works.lyrics = [newWork, ...works.lyrics].slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
    refreshBalance()
    navigate('/works', { state: { expandLyrics: newId } })
  }
  
  const handleCreateMusicWithLyrics = (lyricsData) => {
    navigate('/music', { state: { prefillLyrics: lyricsData } })
  }
  
  return (
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
  )
}

// 歌词页
export function LyricsPage() {
  const { refreshBalance } = useAuth()
  const navigate = useNavigate()
  
  const handleLyricsGenerated = (lyricsData) => {
    const newId = Date.now()
    const newWork = { id: newId, ...lyricsData }
    const saved = localStorage.getItem(STORAGE_KEY)
    const works = saved ? JSON.parse(saved) : { music: [], lyrics: [] }
    works.lyrics = [newWork, ...works.lyrics].slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
    refreshBalance()
    navigate('/works', { state: { expandLyrics: newId } })
  }
  
  const handleCreateMusicWithLyrics = (lyricsData) => {
    navigate('/music', { state: { prefillLyrics: lyricsData } })
  }
  
  return (
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
  )
}

// 歌曲页
export function MusicPage() {
  const { refreshBalance } = useAuth()
  const location = useLocation()
  const prefillLyrics = location.state?.prefillLyrics
  
  const handleMusicGenerated = (musicData) => {
    const newWork = { id: Date.now(), ...musicData }
    const saved = localStorage.getItem(STORAGE_KEY)
    const works = saved ? JSON.parse(saved) : { music: [], lyrics: [] }
    works.music = [newWork, ...works.music].slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
    refreshBalance()
  }
  
  return (
    <section className="panel-section">
      <div className="panel-header">
        <h2>🎵 AI 歌曲创作</h2>
        <p>输入歌词和描述，让 AI 为你创作完整的歌曲</p>
      </div>
      <MusicGenerator 
        onMusicGenerated={handleMusicGenerated}
        prefillLyrics={prefillLyrics}
        onClearPrefillLyrics={() => {}}
      />
    </section>
  )
}

// 作品页
export function WorksPage() {
  const [works, setWorks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { music: [], lyrics: [] }
  })
  
  const deleteWork = (type, id) => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const current = saved ? JSON.parse(saved) : { music: [], lyrics: [] }
    const updated = {
      ...current,
      [type]: current[type].filter(w => w.id !== id)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setWorks(updated)
  }
  
  return <Works works={works} onDelete={deleteWork} />
}

// 帮助页
export function HelpPage() {
  return <Help />
}