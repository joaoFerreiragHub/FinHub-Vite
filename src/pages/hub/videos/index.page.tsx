import { VideoListPage } from '@/features/hub/videos/pages'
import SidebarLayout from '@/shared/layouts/SidebarLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <SidebarLayout>
      <VideoListPage />
    </SidebarLayout>
  )
}
