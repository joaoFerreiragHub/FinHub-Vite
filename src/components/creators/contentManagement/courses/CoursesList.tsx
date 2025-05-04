// src/components/contentManagement/courses/CoursesList.tsx
import { Course } from "../../../../types/course"
import { Button } from "../../../ui/button"
import { Card } from "../../../ui/card"
import { Skeleton } from "../../../ui/skeleton"
import { Eye, EyeOff } from "lucide-react"

interface Props {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string, hidden: boolean) => void
  isLoading: boolean
  error?: Error | null
}

export default function CoursesList({
  courses,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading,
  error,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Erro: {error.message}</p>
  }

  if (!courses.length) {
    return <p className="text-muted-foreground">Nenhum curso disponível.</p>
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <Card key={course._id} className="p-4 space-y-2">
          <img
            src={
              typeof course.bannerImage === "string"
                ? course.bannerImage
                : "/placeholder.jpg"
            }
            alt={course.courseName}
            className="w-full h-40 object-cover rounded"
          />

          <h3 className="text-lg font-semibold">{course.courseName}</h3>
          <p className="text-sm text-muted-foreground">
            {course.description}
          </p>
          <p className="text-sm font-medium">
            Preço: €{course.price.toFixed(2)}
          </p>
          <p className="text-sm">Estado: {course.status}</p>
          {course.purchaseLink && (
            <a
              href={course.purchaseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline"
            >
              Comprar
            </a>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() =>
                onToggleVisibility(course._id, !course.hidden)
              }
            >
              {course.hidden ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" /> Mostrar
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" /> Ocultar
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={() => onEdit(course)}>
              Editar
            </Button>
            <Button variant="destructive" onClick={() => onDelete(course._id)}>
              Apagar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
