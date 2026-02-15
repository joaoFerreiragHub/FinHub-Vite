import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookService } from '../services/bookService'
import type { ContentFilters } from '../../types'
import type { CreateBookDto, UpdateBookDto } from '../types'

export function useBooks(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => bookService.getBooks(filters),
  })
}

export function useBook(slug: string) {
  return useQuery({
    queryKey: ['book', slug],
    queryFn: () => bookService.getBookBySlug(slug),
    enabled: !!slug,
  })
}

export function useMyBooks(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['my-books', filters],
    queryFn: () => bookService.getMyBooks(filters),
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookDto) => bookService.createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-books'] })
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookDto }) =>
      bookService.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['my-books'] })
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['my-books'] })
    },
  })
}

export function usePublishBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bookService.publishBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['my-books'] })
    },
  })
}
