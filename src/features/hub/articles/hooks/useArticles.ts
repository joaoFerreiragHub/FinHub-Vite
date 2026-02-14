import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { articleService } from '../services/articleService'
import type { ArticleFilters, CreateArticleDto, UpdateArticleDto } from '../types'

/**
 * Hook para buscar lista de artigos
 */
export function useArticles(filters?: ArticleFilters) {
  return useQuery({
    queryKey: ['articles', filters],
    queryFn: () => articleService.getArticles(filters),
  })
}

/**
 * Hook para buscar artigo por slug
 */
export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleService.getArticleBySlug(slug),
    enabled: !!slug,
  })
}

/**
 * Hook para buscar artigos do creator atual
 */
export function useMyArticles(filters?: ArticleFilters) {
  return useQuery({
    queryKey: ['my-articles', filters],
    queryFn: () => articleService.getMyArticles(filters),
  })
}

/**
 * Hook para criar artigo
 */
export function useCreateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateArticleDto) => articleService.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] })
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

/**
 * Hook para atualizar artigo
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleDto }) =>
      articleService.updateArticle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['article', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['my-articles'] })
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

/**
 * Hook para eliminar artigo
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => articleService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] })
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

/**
 * Hook para publicar artigo
 */
export function usePublishArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => articleService.publishArticle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['article', id] })
      queryClient.invalidateQueries({ queryKey: ['my-articles'] })
    },
  })
}

/**
 * Hook para like/unlike
 */
export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => articleService.toggleLike(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['article', id] })
    },
  })
}

/**
 * Hook para favorite/unfavorite
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => articleService.toggleFavorite(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['article', id] })
    },
  })
}
