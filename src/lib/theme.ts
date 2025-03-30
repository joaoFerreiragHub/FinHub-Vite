// src/lib/theme.ts
export function applyTheme(theme: 'light' | 'dark') {
  const root = window.document.documentElement

  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
