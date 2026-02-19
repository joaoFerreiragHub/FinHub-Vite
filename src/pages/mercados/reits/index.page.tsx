import { HomepageLayout } from '@/components/home/HomepageLayout'
import ReitsToolkitPage from '@/features/markets/pages/ReitsToolkitPage'

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <ReitsToolkitPage />
      </div>
    </HomepageLayout>
  )
}

export default { Page }
