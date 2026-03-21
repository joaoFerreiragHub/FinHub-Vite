import { HomepageLayout } from '@/components/home/HomepageLayout'
import { ExploreHubPage } from '@/features/explore/pages/ExploreHubPage'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <HomepageLayout>
      <ExploreHubPage />
    </HomepageLayout>
  )
}
