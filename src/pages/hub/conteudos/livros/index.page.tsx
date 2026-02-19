import { BookListPage } from '@/features/hub/books/pages'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <HomepageLayout>
      <BookListPage />
    </HomepageLayout>
  )
}
