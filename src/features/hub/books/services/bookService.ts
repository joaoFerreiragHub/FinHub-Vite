import { apiClient } from '@/lib/api/client'
import type { Book, CreateBookDto, UpdateBookDto } from '../types'
import type { ContentListResponse, ContentFilters } from '../../types'

/**
 * Book Service
 */
export const bookService = {
  getBooks: async (filters?: ContentFilters): Promise<ContentListResponse<Book>> => {
    const response = await apiClient.get<ContentListResponse<Book>>('/books', {
      params: filters,
    })
    return response.data
  },

  getBookBySlug: async (slug: string): Promise<Book> => {
    const response = await apiClient.get<Book>(`/books/${slug}`)
    return response.data
  },

  createBook: async (data: CreateBookDto): Promise<Book> => {
    const response = await apiClient.post<Book>('/books', data)
    return response.data
  },

  updateBook: async (id: string, data: UpdateBookDto): Promise<Book> => {
    const response = await apiClient.patch<Book>(`/books/${id}`, data)
    return response.data
  },

  deleteBook: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`)
  },

  publishBook: async (id: string): Promise<Book> => {
    const response = await apiClient.post<Book>(`/books/${id}/publish`)
    return response.data
  },

  getMyBooks: async (filters?: ContentFilters): Promise<ContentListResponse<Book>> => {
    const response = await apiClient.get<ContentListResponse<Book>>('/books/me', {
      params: filters,
    })
    return response.data
  },

  // ========== ACTIONS ==========

  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/books/${id}/view`)
  },

  toggleLike: async (id: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<{ liked: boolean; likeCount: number }>(
      `/books/${id}/like`,
    )
    return response.data
  },

  toggleFavorite: async (id: string): Promise<{ favorited: boolean; favoriteCount: number }> => {
    const response = await apiClient.post<{ favorited: boolean; favoriteCount: number }>(
      `/books/${id}/favorite`,
    )
    return response.data
  },
}
