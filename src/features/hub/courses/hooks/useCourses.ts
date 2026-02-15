import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseService } from '../services/courseService'
import type { ContentFilters } from '../../types'
import type { CreateCourseDto, UpdateCourseDto } from '../types'

export function useCourses(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => courseService.getCourses(filters),
  })
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: !!slug,
  })
}

export function useMyCourses(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['my-courses', filters],
    queryFn: () => courseService.getMyCourses(filters),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCourseDto) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseDto }) =>
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}

export function usePublishCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => courseService.publishCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}

export function useEnrollCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => courseService.enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
