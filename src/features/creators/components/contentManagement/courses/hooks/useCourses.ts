// src/components/contentManagement/courses/hooks/useCourses.ts

import type { Course } from '@/features/hub/courses/types/course'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_URL}/courses`)
  if (!res.ok) throw new Error('Erro ao carregar cursos')
  return await res.json()
}

export const createCourse = async (course: Partial<Course>): Promise<Course> => {
  const formData = new FormData()
  Object.entries(course).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value))
      }
    }
  })

  const res = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Erro ao criar curso')
  return await res.json()
}

export const updateCourse = async (id: string, course: Partial<Course>): Promise<void> => {
  const formData = new FormData()

  Object.entries(course).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value))
      }
    }
  })

  const res = await fetch(`${API_URL}/courses/${id}`, {
    method: 'PUT',
    body: formData,
  })

  if (!res.ok) throw new Error('Erro ao atualizar curso')
}

export const deleteCourse = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/courses/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Erro ao apagar curso')
}
export const toggleCourseVisibility = async (id: string, hidden: boolean): Promise<void> => {
  const res = await fetch(`${API_URL}/courses/${id}/visibility`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hidden }),
  })
  if (!res.ok) throw new Error('Erro ao atualizar visibilidade')
}
