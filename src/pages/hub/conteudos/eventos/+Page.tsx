import { LiveListPage } from '@/features/hub/lives/pages'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <HomepageLayout>
      <LiveListPage />
    </HomepageLayout>
  )
}
