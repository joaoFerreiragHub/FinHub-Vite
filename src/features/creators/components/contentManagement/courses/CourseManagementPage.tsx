import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import CourseForm from './CourseForm'
import CoursesList from './CoursesList'
import CourseVisibilityToggle from './CourseVisibilityToggle'
import { createCourse, deleteCourse, getCourses, updateCourse } from './hooks/useCourses'
import { mockCourses } from '@/lib/mock/mockCourses'
import type { Course } from '@/features/hub/courses/types/course'

const useMockData = true

type FilterOption = 'todos' | 'escondidos' | 'mais-vistos' | 'menos-vistos'

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [selectedTab, setSelectedTab] = useState<FilterOption>('todos')

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (useMockData) {
        setCourses(mockCourses.map((c) => ({ ...c, hidden: c.hidden ?? false })))
      } else {
        const data = await getCourses()
        setCourses(data)
      }
    } catch {
      toast.error('Erro ao carregar cursos.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleVisibility = async () => {
    try {
      const newVisibility = !isVisible
      setIsVisible(newVisibility)
      toast.success('Visibilidade geral atualizada!')
    } catch {
      toast.error('Erro ao atualizar visibilidade geral.')
    }
  }

  const handleToggleCourseVisibility = (id: string) => {
    setCourses((prev) =>
      prev.map((course) => (course._id === id ? { ...course, hidden: !course.hidden } : course)),
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres apagar este curso?')) return
    try {
      if (useMockData) {
        setCourses((prev) => prev.filter((c) => c._id !== id))
        toast.success('Curso removido com sucesso.')
        return
      }

      await deleteCourse(id)
      fetchData()
      toast.success('Curso removido com sucesso.')
    } catch {
      toast.error('Erro ao apagar curso.')
    }
  }

  const handleSave = async (course: Partial<Course>) => {
    try {
      if (useMockData) {
        toast.success('Simulação: curso guardado.')
        return
      }

      if (editingCourse) {
        await updateCourse(editingCourse._id, course)
        toast.success('Curso atualizado com sucesso.')
      } else {
        const novoCurso = await createCourse(course)
        setCourses((prev) => [...prev, novoCurso])
        toast.success('Curso adicionado com sucesso.')
      }

      setIsDialogOpen(false)
      setEditingCourse(null)
      fetchData()
    } catch {
      toast.error('Erro ao guardar curso.')
    }
  }

  const filteredCourses = courses.filter((course) => {
    if (!isVisible) return false
    if (selectedTab === 'escondidos') return course.hidden
    if (selectedTab === 'mais-vistos') return course.views && course.views > 1000
    if (selectedTab === 'menos-vistos') return !course.views || course.views <= 1000
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestão de Cursos</h1>
        <Button
          onClick={() => {
            setIsDialogOpen(true)
            setEditingCourse(null)
          }}
        >
          Novo Curso
        </Button>
      </div>

      <CourseVisibilityToggle isVisible={isVisible} onToggle={handleToggleVisibility} />

      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setSelectedTab('todos')}
          className={selectedTab === 'todos' ? 'font-bold' : ''}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedTab('mais-vistos')}
          className={selectedTab === 'mais-vistos' ? 'font-bold' : ''}
        >
          Mais vistos
        </button>
        <button
          onClick={() => setSelectedTab('menos-vistos')}
          className={selectedTab === 'menos-vistos' ? 'font-bold' : ''}
        >
          Menos vistos
        </button>
        <button
          onClick={() => setSelectedTab('escondidos')}
          className={selectedTab === 'escondidos' ? 'font-bold' : ''}
        >
          Ocultos
        </button>
      </div>

      <CoursesList
        courses={filteredCourses}
        onEdit={(course) => {
          setEditingCourse(course)
          setIsDialogOpen(true)
        }}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleCourseVisibility}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
          </DialogHeader>
          <CourseForm
            course={editingCourse}
            onSave={handleSave}
            onCancel={() => {
              setIsDialogOpen(false)
              setEditingCourse(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
