import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8083'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // 登出函数（用 useCallback 包裹，供事件监听使用）
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('music_token')
    localStorage.removeItem('music_user')
  }, [])

  // 从 localStorage 恢复登录状态 & 监听 token 过期事件
  useEffect(() => {
    const savedToken = localStorage.getItem('music_token')
    const savedUser = localStorage.getItem('music_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)

    // 监听 API 层 401 过期事件
    const handleAuthExpired = () => {
      setToken(null)
      setUser(null)
    }
    window.addEventListener('music-auth-expired', handleAuthExpired)
    // 依赖[]，组件卸载时执行return
    return () => window.removeEventListener('music-auth-expired', handleAuthExpired)
  }, []) // 依赖[]，首次挂载时执行一次

  // 登录
  const login = async (account, password) => {
    const response = await axios.post(`${API_BASE}/music/login`, {
      account,
      password
    })
    const result = response.data
    if (result.code === 200) {
      const { token: newToken, uid, account: userAccount, balance } = result.data
      const userData = { uid, account: userAccount, balance }
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('music_token', newToken)
      localStorage.setItem('music_user', JSON.stringify(userData))
      return { success: true }
    } else {
      throw new Error(result.msg || '登录失败')
    }
  }

  // 刷新余额
  const refreshBalance = async () => {
    if (!token) return
    try {
      const response = await axios.get(`${API_BASE}/music/balance`, {
        headers: { Authorization: token }
      })
      const result = response.data
      if (result.code === 200) {
        const updatedUser = { ...user, balance: result.data.balance }
        setUser(updatedUser)
        localStorage.setItem('music_user', JSON.stringify(updatedUser))
      }
    } catch (err) {
      console.error('刷新余额失败:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
