import { HomepageLayout } from '@/components/home/HomepageLayout'
import MarketStocksPage from '@/features/markets/pages/MarketStocksPage'

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <MarketStocksPage />
      </div>
    </HomepageLayout>
  )
}

export default { Page }
