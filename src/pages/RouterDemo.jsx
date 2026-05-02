import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function RouterDemo() {
  const navigate = useNavigate()
  const [inputPath, setInputPath] = useState('')

  // 编程式导航 - 函数式跳转
  const goToPath = (path) => {
    navigate(path)
  }

  const goBack = () => {
    navigate(-1) // 后退
  }

  const goForward = () => {
    navigate(1) // 前进
  }

  // 带状态的编程式导航
  const navigateWithState = (path) => {
    navigate(path, { 
      state: { fromDemo: true, timestamp: Date.now() } 
    })
  }

  return (
    <div className="router-demo" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>🧭 React Router 导航示例</h2>

      {/* 声明式导航 - 使用 Link 组件 */}
      <section style={{ marginBottom: '30px', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px' }}>📍 声明式导航 (Link)</h3>
        <p style={{ marginBottom: '15px', color: '#666' }}>
          使用 <code>{'<Link to="路径">'}</code> 组件创建可访问的链接，类似于传统的 <code>&lt;a&gt;</code> 标签，但不会触发页面刷新。
        </p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <Link to="/" style={linkStyle}>首页</Link>
          <Link to="/lyrics" style={linkStyle}>歌词创作</Link>
          <Link to="/music" style={linkStyle}>歌曲创作</Link>
          <Link to="/works" style={linkStyle}>我的作品</Link>
          <Link to="/help" style={linkStyle}>使用说明</Link>
        </div>

        <pre style={{ background: '#333', color: '#fff', padding: '15px', borderRadius: '4px', fontSize: '13px' }}>
{`<Link to="/路径">链接文本</Link>

// 示例
<Link to="/lyrics">歌词创作</Link>
<Link to="/music">歌曲创作</Link>
<Link to="/works">我的作品</Link>`}
        </pre>
      </section>

      {/* 编程式导航 - 使用 useNavigate */}
      <section style={{ marginBottom: '30px', padding: '20px', background: '#aaf9ff', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px' }}>⚡ 编程式导航 (useNavigate)</h3>
        <p style={{ marginBottom: '15px', color: '#666' }}>
          使用 <code>useNavigate()</code> Hook 在事件处理函数中动态跳转，常用于表单提交后跳转、权限验证等场景。
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <button style={buttonStyle} onClick={() => goToPath('/lyrics')}>跳转歌词创作</button>
          <button style={buttonStyle} onClick={() => goToPath('/music')}>跳转歌曲创作</button>
          <button style={buttonStyle} onClick={() => goToPath('/works')}>跳转我的作品</button>
          <button style={buttonStyle} onClick={goBack}>◀ 后退</button>
          <button style={buttonStyle} onClick={goForward}>▶ 前进</button>
        </div>

        <pre style={{ background: '#333', color: '#fff', padding: '15px', borderRadius: '4px', fontSize: '13px' }}>
{`// 1. 基本跳转
const navigate = useNavigate()
navigate('/lyrics')

// 2. 带状态跳转
navigate('/music', { state: { fromLyrics: true } })

// 3. 历史记录操作
navigate(-1)  // 后退
navigate(1)   // 前进
navigate(-2)  // 后退两步

// 4. 替换当前记录（不保留历史）
navigate('/new-path', { replace: true })`}
        </pre>
      </section>

      {/* 带状态的导航 */}
      <section style={{ marginBottom: '30px', padding: '20px', background: '#aaf9ff', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px' }}>📦 带状态的导航</h3>
        <p style={{ marginBottom: '15px', color: '#666' }}>
          通过 <code>navigate(path, {'{ state: {...} }'})</code> 可以传递数据，接收页面通过 <code>useLocation().state</code> 获取。
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <button style={buttonStyle} onClick={() => navigateWithState('/lyrics')}>
            带状态跳转歌词
          </button>
          <button style={buttonStyle} onClick={() => navigateWithState('/works')}>
            带状态跳转作品
          </button>
        </div>

        <pre style={{ background: '#333', color: '#fff', padding: '15px', borderRadius: '4px', fontSize: '13px' }}>
{`// 发送端 - 跳转时传递状态
navigate('/works', { 
  state: { expandLyrics: 123, fromDemo: true } 
})

// 接收端 - 在目标页面获取状态
import { useLocation } from 'react-router-dom'

function MyComponent() {
  const location = useLocation()
  const { expandLyrics, fromDemo } = location.state || {}
  
  // 使用状态...
}`}
        </pre>
      </section>

      {/* 动态路径输入 */}
      <section style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px' }}>⌨️ 动态路径跳转</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input 
            type="text" 
            value={inputPath} 
            onChange={(e) => setInputPath(e.target.value)}
            placeholder="输入路径，如 /lyrics"
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button 
            style={{ ...buttonStyle, background: '#4caf50', color: '#fff' }}
            onClick={() => {
              if (inputPath.trim()) {
                goToPath(inputPath.trim())
              }
            }}
          >
            跳转
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#666' }}>
          提示：输入 /、/lyrics、/music、/works、/help 进行跳转
        </p>
      </section>
    </div>
  )
}

const linkStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  background: '#4a90d9',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '14px'
}

const buttonStyle = {
  padding: '10px 20px',
  background: '#2196f3',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
}