import { ArticleListPage } from '@/features/hub/articles/pages'
import SidebarLayout from '@/shared/layouts/SidebarLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <SidebarLayout>
      <ArticleListPage />
    </SidebarLayout>
  )
}
