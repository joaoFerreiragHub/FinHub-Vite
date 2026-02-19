import { ArticleListPage } from '@/features/hub/articles/pages'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <HomepageLayout>
      <ArticleListPage />
    </HomepageLayout>
  )
}
