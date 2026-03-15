import FireDashboardPage from '@/features/fire/pages/FireDashboardPage'
import { FireRequireAuth } from '../_components/FireRequireAuth'

export function Page() {
  return (
    <FireRequireAuth>
      <FireDashboardPage />
    </FireRequireAuth>
  )
}
