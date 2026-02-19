import { HomepageLayout } from '@/components/home/HomepageLayout'
import EtfOverlapPage from '@/features/markets/pages/EtfOverlapPage'

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <EtfOverlapPage />
      </div>
    </HomepageLayout>
  )
}

export default { Page }
