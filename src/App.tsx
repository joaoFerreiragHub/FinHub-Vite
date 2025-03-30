import { PageTracker } from './components/providers/PageTracker'
import { ToggleTheme } from './components/ui/toggle-theme'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <PageTracker />
      <ToggleTheme />
      <h1 className="text-2xl font-bold mt-4">Olá FinHub! 🚀</h1>
    </div>
  )
}

export default App
