import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ToggleThemeSimple() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Apenas execute este efeito no cliente
  useEffect(() => {
    setMounted(true)
    console.log('ToggleTheme montado, tema atual:', theme)
  }, [theme])

  // Função para alternar o tema usando next-themes
  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    console.log('Alterando tema para:', newTheme)
    setTheme(newTheme)
  }

  // Enquanto não for montado, retorna um espaço reservado com as mesmas dimensões
  if (!mounted) {
    return (
      <div className="p-2 rounded-md bg-gray-200 text-gray-800 opacity-50">
        <Sun className="h-5 w-5" />
      </div>
    )
  }

  // Com componente montado, retorna o botão interativo
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
