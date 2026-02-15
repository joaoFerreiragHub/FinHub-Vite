import { PodcastListPage } from '@/features/hub/podcasts/pages'
import SidebarLayout from '@/shared/layouts/SidebarLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <SidebarLayout>
      <PodcastListPage />
    </SidebarLayout>
  )
}
