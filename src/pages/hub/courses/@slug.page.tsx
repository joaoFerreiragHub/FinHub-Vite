import { CourseDetailPage } from '@/features/hub/courses/pages'
import SidebarLayout from '@/shared/layouts/SidebarLayout'

export const passToClient = ['routeParams', 'pageProps']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Page(props: any) {
  const slug = props.pageContext?.routeParams?.slug ?? props.routeParams?.slug ?? props.slug

  if (!slug) {
    return (
      <SidebarLayout>
        <div className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-center text-muted-foreground">Curso não encontrado</p>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <CourseDetailPage slug={slug} />
    </SidebarLayout>
  )
}
