// src/components/ui/toggle-theme.tsx

import { useEffect } from 'react'
import { useThemeStore } from '../../stores/useThemeStore'

export const ToggleTheme = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
  }

  return (
    <button onClick={toggle} className="px-4 py-2 rounded bg-muted text-foreground hover:bg-accent">
      {theme === 'dark' ? '🌞 Claro' : '🌙 Escuro'}
    </button>
  )
}
