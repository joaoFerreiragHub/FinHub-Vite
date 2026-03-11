import { PodcastListPage } from '@/features/hub/podcasts/pages'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <HomepageLayout>
      <PodcastListPage />
    </HomepageLayout>
  )
}
