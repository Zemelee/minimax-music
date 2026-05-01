import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!account.trim()) {
      setError('请输入邮箱')
      return
    }
    if (!password.trim()) {
      setError('请输入密码')
      return
    }

    setLoading(true)
    try {
      await login(account.trim(), password.trim())
    } catch (err) {
      setError(err.response?.data?.msg || err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h1>AI 音乐工坊</h1>
          <p>使用您的 <a href="http://sugarblack.top" target='_blank'>Q11E账号</a> 登录以开始创作</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>邮箱</label>
            <input
              type="text"
              value={account}
              onChange={(e) => { setAccount(e.target.value); setError('') }}
              placeholder="请输入注册邮箱"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="请输入密码"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="login-footer">
          <p>使用 <a href="http://sugarblack.top" target='_blank'>Q11E账号</a> 登录</p>
        </div>
        <div className="login-footer" style={{ marginTop: '8px' }}>
          <p>若需注册、充值额度，请前往 <a href="http://sugarblack.top" target='_blank'>http://sugarblack.top</a></p>
        </div>
      </div>
    </div>
  )
}
