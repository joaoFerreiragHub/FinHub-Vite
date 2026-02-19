import { CourseListPage } from '@/features/hub/courses/pages'
import { HomepageLayout } from '@/components/home/HomepageLayout'

export const passToClient = ['pageProps']

export function Page() {
  return (
    <HomepageLayout>
      <CourseListPage />
    </HomepageLayout>
  )
}
