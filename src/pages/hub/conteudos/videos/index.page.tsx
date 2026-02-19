import { VideoListPage } from '@/features/hub/videos/pages'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <HomepageLayout>
      <VideoListPage />
    </HomepageLayout>
  )
}
