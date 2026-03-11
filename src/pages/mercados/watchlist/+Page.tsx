import { HomepageLayout } from '@/components/home/HomepageLayout'
import MarketWatchlistPage from '@/features/markets/pages/MarketWatchlistPage'

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <MarketWatchlistPage />
      </div>
    </HomepageLayout>
  )
}

export default { Page }
