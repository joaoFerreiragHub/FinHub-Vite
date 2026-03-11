import { HomepageLayout } from '@/components/home/HomepageLayout'
import CryptoListPage from '@/features/markets/pages/CryptoListPage'

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <CryptoListPage />
      </div>
    </HomepageLayout>
  )
}

export default { Page }
