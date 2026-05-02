import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GenerationProvider } from './context/GenerationContext'
import Layout from './components/Layout'
import AuthWrapper from './components/AuthWrapper'
import { HomePage, LyricsPage, MusicPage, WorksPage, HelpPage } from './components/Pages'
import NotFound from './pages/NotFound'
import RouterDemo from './pages/RouterDemo'
import './index.css'
import './styles/auth.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthWrapper><Layout><HomePage /></Layout></AuthWrapper>
  },
  {
    path: '/lyrics',
    element: <AuthWrapper><Layout><LyricsPage /></Layout></AuthWrapper>
  },
  {
    path: '/music',
    element: <AuthWrapper><Layout><MusicPage /></Layout></AuthWrapper>
  },
  {
    path: '/works',
    element: <AuthWrapper><Layout><WorksPage /></Layout></AuthWrapper>
  },
  {
    path: '/help',
    element: <AuthWrapper><Layout><HelpPage /></Layout></AuthWrapper>
  },
  {
    path: '/demo',
    element: <RouterDemo />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GenerationProvider>
        <RouterProvider router={router} />
      </GenerationProvider>
    </AuthProvider>
  </React.StrictMode>
)