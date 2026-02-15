import { useParams, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/layouts'
import { CourseForm } from '../components/CourseForm'
import { useCourse, useUpdateCourse } from '@/features/hub/courses/hooks/useCourses'
import { Card } from '@/components/ui'
import type { UpdateCourseDto } from '@/features/hub/courses/types'

/**
 * Pagina de edicao de curso
 */
export function EditCourse() {
  const { id } = useParams<{ id: string }>()
  const { data: course, isLoading, error } = useCourse(id!)
  const updateCourse = useUpdateCourse()

  const handleSubmit = async (data: UpdateCourseDto) => {
    if (!id) return
    await updateCourse.mutateAsync({ id, data })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !course) {
    return <Navigate to="/creators/dashboard/courses" replace />
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editar Curso</h1>
          <p className="mt-1 text-muted-foreground">
            A editar: <span className="font-medium">{course.title}</span>
          </p>
        </div>

        <Card className="p-8">
          <CourseForm
            course={course}
            onSubmit={handleSubmit}
            submitText="Atualizar Curso"
            showDraftOption={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  )
}
