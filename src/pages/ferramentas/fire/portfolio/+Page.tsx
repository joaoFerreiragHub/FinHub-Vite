import FirePortfolioPage from '@/features/fire/pages/FirePortfolioPage'
import { FireRequireAuth } from '../_components/FireRequireAuth'

export function Page() {
  return (
    <FireRequireAuth>
      <FirePortfolioPage />
    </FireRequireAuth>
  )
}
