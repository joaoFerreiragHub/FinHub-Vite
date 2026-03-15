import FireSimulatorPage from '@/features/fire/pages/FireSimulatorPage'
import { FireRequireAuth } from '../_components/FireRequireAuth'

export function Page() {
  return (
    <FireRequireAuth>
      <FireSimulatorPage />
    </FireRequireAuth>
  )
}
