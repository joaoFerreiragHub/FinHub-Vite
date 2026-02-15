import { LiveListPage } from '@/features/hub/lives/pages'
import SidebarLayout from '@/shared/layouts/SidebarLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <SidebarLayout>
      <LiveListPage />
    </SidebarLayout>
  )
}
