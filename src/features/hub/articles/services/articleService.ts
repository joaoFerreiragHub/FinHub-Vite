import { apiClient } from '@/lib/api/client'
import type { Article, CreateArticleDto, UpdateArticleDto, ArticleFilters } from '../types'
import type { ContentListResponse } from '../../types'

/**
 * Article Service
 * Gerencia todas as chamadas de API relacionadas a artigos
 */
export const articleService = {
  /**
   * Buscar artigos (público)
   */
  getArticles: async (filters?: ArticleFilters): Promise<ContentListResponse<Article>> => {
    const response = await apiClient.get<ContentListResponse<Article>>('/articles', {
      params: filters,
    })
    return response.data
  },

  /**
   * Buscar artigo por slug (público)
   */
  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await apiClient.get<Article>(`/articles/${slug}`)
    return response.data
  },

  /**
   * Buscar artigo por ID (público)
   */
  getArticleById: async (id: string): Promise<Article> => {
    const response = await apiClient.get<Article>(`/articles/id/${id}`)
    return response.data
  },

  /**
   * Criar artigo (CREATOR/ADMIN)
   */
  createArticle: async (data: CreateArticleDto): Promise<Article> => {
    const response = await apiClient.post<Article>('/articles', data)
    return response.data
  },

  /**
   * Atualizar artigo (CREATOR/ADMIN)
   */
  updateArticle: async (id: string, data: UpdateArticleDto): Promise<Article> => {
    const response = await apiClient.patch<Article>(`/articles/${id}`, data)
    return response.data
  },

  /**
   * Eliminar artigo (CREATOR/ADMIN)
   */
  deleteArticle: async (id: string): Promise<void> => {
    await apiClient.delete(`/articles/${id}`)
  },

  /**
   * Publicar artigo (CREATOR/ADMIN)
   */
  publishArticle: async (id: string): Promise<Article> => {
    const response = await apiClient.post<Article>(`/articles/${id}/publish`)
    return response.data
  },

  /**
   * Despublicar artigo (CREATOR/ADMIN)
   */
  unpublishArticle: async (id: string): Promise<Article> => {
    const response = await apiClient.post<Article>(`/articles/${id}/unpublish`)
    return response.data
  },

  /**
   * Buscar artigos do creator atual (CREATOR/ADMIN)
   */
  getMyArticles: async (filters?: ArticleFilters): Promise<ContentListResponse<Article>> => {
    const response = await apiClient.get<ContentListResponse<Article>>('/articles/me', {
      params: filters,
    })
    return response.data
  },

  /**
   * Incrementar view count
   */
  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/articles/${id}/view`)
  },

  /**
   * Like/Unlike artigo
   */
  toggleLike: async (id: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<{ liked: boolean; likeCount: number }>(
      `/articles/${id}/like`
    )
    return response.data
  },

  /**
   * Favorite/Unfavorite artigo
   */
  toggleFavorite: async (
    id: string
  ): Promise<{ favorited: boolean; favoriteCount: number }> => {
    const response = await apiClient.post<{ favorited: boolean; favoriteCount: number }>(
      `/articles/${id}/favorite`
    )
    return response.data
  },
}
