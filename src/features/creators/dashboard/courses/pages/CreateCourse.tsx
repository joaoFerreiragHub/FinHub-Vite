import { DashboardLayout } from '@/shared/layouts'
import { CourseForm } from '../components/CourseForm'
import { useCreateCourse } from '@/features/hub/courses/hooks/useCourses'
import { Card } from '@/components/ui'
import type { CreateCourseDto } from '@/features/hub/courses/types'

/**
 * Pagina de criacao de curso
 */
export function CreateCourse() {
  const createCourse = useCreateCourse()

  const handleSubmit = async (data: CreateCourseDto) => {
    await createCourse.mutateAsync(data)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Curso</h1>
          <p className="mt-1 text-muted-foreground">
            Partilha o teu conhecimento com cursos estruturados
          </p>
        </div>

        <Card className="p-8">
          <CourseForm onSubmit={handleSubmit} submitText="Criar Curso" />
        </Card>

        <Card className="border-dashed bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Dicas para um bom curso</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>- Define objectivos de aprendizagem claros</li>
            <li>- Estrutura o conteudo em modulos logicos</li>
            <li>- Mistura video, texto e exercicios praticos</li>
            <li>- Oferece aulas preview gratuitas para atrair alunos</li>
            <li>- Inclui uma imagem de capa profissional</li>
            <li>- Define pre-requisitos para alinhar expectativas</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
