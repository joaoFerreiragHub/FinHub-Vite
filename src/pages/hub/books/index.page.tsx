import { BookListPage } from '@/features/hub/books/pages'
import SidebarLayout from '@/shared/layouts/SidebarLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <SidebarLayout>
      <BookListPage />
    </SidebarLayout>
  )
}
