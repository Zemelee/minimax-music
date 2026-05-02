import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ fontSize: '120px', marginBottom: '20px' }}>🚫</div>
      <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '30px', color: '#aaa' }}>
        页面不存在
      </h2>
      <p style={{ fontSize: '16px', color: '#888', marginBottom: '40px', maxWidth: '400px', textAlign: 'center' }}>
        抱歉，您访问的页面不存在或已被删除
      </p>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: '2px solid #4a90d9',
            color: '#4a90d9',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
        >
          ← 返回上一页
        </button>
        <Link 
          to="/"
          style={{
            padding: '12px 24px',
            background: '#4a90d9',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
        >
          🏠 回首页
        </Link>
      </div>

      <div style={{ marginTop: '60px', color: '#555', fontSize: '14px' }}>
        <p>AI 音乐工坊 · MiniMax Music Studio</p>
      </div>
    </div>
  )
}