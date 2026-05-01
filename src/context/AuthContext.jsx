import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

const AuthContext = createContext(null) // 创建上下文

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8083'

// 上下文提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(null)
  const balanceFetching = useRef(false) // 访问dom，存储不触发渲染的变量

  // 登出函数
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setBalance(null)
    localStorage.removeItem('music_token')
    localStorage.removeItem('music_user')
  }, [])

    // 登录
  const login = async (account, password) => {
    const response = await axios.post(`${API_BASE}/music/login`, {
      account,
      password
    })
    const result = response.data
    if (result.code === 200) {
      const { token: newToken, uid, account: userAccount } = result.data
      const userData = { uid, account: userAccount }
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('music_token', newToken)
      localStorage.setItem('music_user', JSON.stringify(userData))
      return { success: true }
    } else {
      throw new Error(result.msg || '登录失败')
    }
  }

  // 获取余额（从服务端实时获取）
  const fetchBalance = useCallback(async () => {
    if (!token || balanceFetching.current) return
    balanceFetching.current = true
    try {
      const response = await axios.get(`${API_BASE}/music/balance`, {
        headers: { Authorization: token }
      })
      const result = response.data
      if (result.code === 200) {
        setBalance(result.data.balance)
      }
    } catch (err) {
      console.error('获取余额失败:', err)
    } finally {
      balanceFetching.current = false
    }
  }, [token])

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
      setBalance(null)
    }
    window.addEventListener('music-auth-expired', handleAuthExpired)
    // 依赖[]，组件卸载时执行return
    return () => window.removeEventListener('music-auth-expired', handleAuthExpired)
  }, []) // 依赖[]，首次挂载时执行一次

  // token 变化时获取余额
  useEffect(() => {
    if (token) {
      fetchBalance()
    }
  }, [token, fetchBalance])



  // 刷新余额（供外部调用，如生成成功后）
  const refreshBalance = useCallback(() => {
    balanceFetching.current = false
    fetchBalance()
  }, [fetchBalance])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, balance, refreshBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext) // 读取上下文
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
