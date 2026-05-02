import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'

export default function AuthWrapper({ children }) {
  const { user, loading } = useAuth()
  
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
  
  return children
}