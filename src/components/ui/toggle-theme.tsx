// src/components/ui/toggle-theme.tsx
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function ToggleTheme() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    // Marca como montado para evitar SSR mismatch
    setMounted(true)

    // Se não houver nada guardado ainda, guarda o tema atual (para visitantes)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (!stored && resolvedTheme) {
        localStorage.setItem('theme', resolvedTheme)
      }
    }
  }, [resolvedTheme])

  function handleToggle() {
    if (!mounted) return

    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme) // <-- guarda a escolha localmente
  }

  if (!mounted) {
    return (
      <button
        disabled
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Carregando tema"
      >
        <Moon className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Alternar tema"
      type="button"
    >
      {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
