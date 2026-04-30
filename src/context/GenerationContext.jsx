import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const GenerationContext = createContext(null)

export function GenerationProvider({ children }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationType, setGenerationType] = useState(null) // 'music' | 'lyrics'

  // 开始生成
  const startGeneration = useCallback((type) => {
    setIsGenerating(true)
    setGenerationType(type)
  }, [])

  // 结束生成
  const stopGeneration = useCallback(() => {
    setIsGenerating(false)
    setGenerationType(null)
  }, [])

  // 防止关闭页面
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isGenerating) {
        e.preventDefault()
        e.returnValue = '正在生成中，确定要离开吗？'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isGenerating])

  return (
    <GenerationContext.Provider value={{ isGenerating, generationType, startGeneration, stopGeneration }}>
      {children}
    </GenerationContext.Provider>
  )
}

export function useGeneration() {
  const context = useContext(GenerationContext)
  if (!context) {
    throw new Error('useGeneration must be used within a GenerationProvider')
  }
  return context
}
