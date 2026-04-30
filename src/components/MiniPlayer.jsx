import { useState, useRef, useEffect, useCallback } from 'react'

export default function MiniPlayer({ audioUrl, isPlaying: externalPlaying, onClose }) {
  const audioRef = useRef(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [showVolume, setShowVolume] = useState(false)
  const [audioReady, setAudioReady] = useState(false)

  // 加载音频
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      setAudioReady(false)
      audioRef.current.src = audioUrl
      audioRef.current.load()
      audioRef.current.volume = volume
    }
  }, [audioUrl])

  // 音频准备好后自动播放
  useEffect(() => {
    if (externalPlaying && audioUrl && audioReady && !isPlaying) {
      handlePlay()
    } else if (!externalPlaying && isPlaying) {
      handlePause()
    }
  }, [externalPlaying, audioUrl, audioReady])

  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error)
    }
  }, [])

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }, [isPlaying, handlePlay, handlePause])

  // Canvas 音频可视化 - 更平滑的动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // 使用较少的bar数量，更大的尺寸
    const bars = 16
    const barWidth = width / bars - 4
    const barMaxHeight = height - 8

    // 保存每个bar的高度和目标高度，实现平滑过渡
    const barHeights = new Array(bars).fill(0)
    const targetHeights = new Array(bars).fill(0)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < bars; i++) {
        // 生成新的目标高度
        if (isPlaying) {
          targetHeights[i] = Math.random() * barMaxHeight * 0.8 + barMaxHeight * 0.2
        } else {
          targetHeights[i] = barMaxHeight * 0.15
        }

        // 平滑过渡到目标高度
        barHeights[i] += (targetHeights[i] - barHeights[i]) * 0.15

        const barHeight = barHeights[i]
        const x = i * (barWidth + 4) + 2
        const y = (height - barHeight) / 2

        // 渐变色彩
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        const hue = 280 + (i / bars) * 40 // 从粉色到紫色的渐变
        gradient.addColorStop(0, `hsla(${hue}, 90%, 70%, 1)`)
        gradient.addColorStop(1, `hsla(${hue + 20}, 80%, 60%, 1)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 4)
        ctx.fill()

        // 添加高光
        ctx.fillStyle = `hsla(${hue}, 90%, 90%, 0.3)`
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight * 0.3, 4)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = vol
      setVolume(vol)
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="mini-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => setAudioReady(true)}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
        }}
      />

      <div className="mini-player-visual">
        <button className="mini-play-btn" onClick={togglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <div className="visualizer-container">
          <canvas
            ref={canvasRef}
            width="160"
            height="48"
            className="audio-canvas"
          />
        </div>

        <button className="mini-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="mini-progress-section">
        <span className="mini-time">{formatTime(currentTime)}</span>
        <div className="mini-progress-bar">
          <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="mini-progress-slider"
          />
        </div>
        <span className="mini-time">{formatTime(duration)}</span>
      </div>

      <div className="mini-volume-section">
        <button
          className="mini-volume-btn"
          onClick={() => setShowVolume(!showVolume)}
        >
          {volume === 0 ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z"/>
            </svg>
          ) : volume < 0.5 ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
        {showVolume && (
          <div className="mini-volume-popup">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="mini-volume-slider"
              orient="vertical"
            />
          </div>
        )}
      </div>
    </div>
  )
}
