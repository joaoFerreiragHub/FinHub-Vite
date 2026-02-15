import { CourseListPage } from '@/features/hub/courses/pages'
import SidebarLayout from '@/shared/layouts/SidebarLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <SidebarLayout>
      <CourseListPage />
    </SidebarLayout>
  )
}
