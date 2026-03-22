import axios from 'axios'
import { apiClient } from '@/lib/api/client'
import type { Article, CreateArticleDto, UpdateArticleDto, ArticleFilters } from '../types'
import type { ContentListResponse } from '../../types'

type LegacyMyArticlesResponse = {
  articles?: Article[]
  pagination?: {
    page?: number
    limit?: number
    total?: number
    pages?: number
  }
}

function normalizeMyArticlesResponse(
  payload: ContentListResponse<Article> | LegacyMyArticlesResponse,
  requestedLimit?: number,
): ContentListResponse<Article> {
  if (Array.isArray((payload as ContentListResponse<Article>).items)) {
    return payload as ContentListResponse<Article>
  }

  const legacy = payload as LegacyMyArticlesResponse
  const items = Array.isArray(legacy.articles) ? legacy.articles : []
  const limit = legacy.pagination?.limit ?? requestedLimit ?? 20
  const page = legacy.pagination?.page ?? 1
  const total = legacy.pagination?.total ?? items.length
  const offset = Math.max(0, (page - 1) * limit)

  return {
    items,
    total,
    limit,
    offset,
    hasMore: offset + items.length < total,
  }
}

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
    try {
      const response = await apiClient.put<Article>(`/articles/${id}`, data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && [404, 405].includes(error.response?.status ?? 0)) {
        const fallbackResponse = await apiClient.patch<Article>(`/articles/${id}`, data)
        return fallbackResponse.data
      }
      throw error
    }
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
    try {
      const response = await apiClient.post<Article>(`/articles/${id}/publish`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && [404, 405].includes(error.response?.status ?? 0)) {
        const fallbackResponse = await apiClient.patch<Article>(`/articles/${id}/publish`)
        return fallbackResponse.data
      }
      throw error
    }
  },

  /**
   * Despublicar artigo (CREATOR/ADMIN)
   */
  unpublishArticle: async (id: string): Promise<Article> => {
    try {
      const response = await apiClient.post<Article>(`/articles/${id}/unpublish`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && [404, 405].includes(error.response?.status ?? 0)) {
        const fallbackResponse = await apiClient.patch<Article>(`/articles/${id}`, {
          status: 'draft',
        })
        return fallbackResponse.data
      }
      throw error
    }
  },

  /**
   * Buscar artigos do creator atual (CREATOR/ADMIN)
   */
  getMyArticles: async (filters?: ArticleFilters): Promise<ContentListResponse<Article>> => {
    try {
      const response = await apiClient.get<ContentListResponse<Article> | LegacyMyArticlesResponse>(
        '/articles/my',
        {
          params: filters,
        },
      )
      return normalizeMyArticlesResponse(response.data, filters?.limit)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const fallbackResponse = await apiClient.get<
          ContentListResponse<Article> | LegacyMyArticlesResponse
        >('/articles/me', {
          params: filters,
        })
        return normalizeMyArticlesResponse(fallbackResponse.data, filters?.limit)
      }
      throw error
    }
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
  toggleLike: async (
    id: string,
    increment = true,
  ): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<{ liked?: boolean; likeCount?: number; likes?: number }>(
      `/articles/${id}/like`,
      { increment },
    )

    return {
      liked: response.data.liked ?? increment,
      likeCount: Number(response.data.likeCount ?? response.data.likes ?? 0),
    }
  },

  /**
   * Favorite/Unfavorite artigo
   */
  toggleFavorite: async (id: string): Promise<{ favorited: boolean; favoriteCount: number }> => {
    const response = await apiClient.post<{ favorited: boolean; favoriteCount: number }>(
      `/articles/${id}/favorite`,
    )
    return response.data
  },
}
