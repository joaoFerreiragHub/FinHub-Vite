// components/creators/contentManagement/articles/hooks/useArticles.ts

import { useQuery } from "@tanstack/react-query"
import { Article } from "../../../../../types/article"
import { mockArticles } from "../../../../../mock/mockArticles"


const fetchArticles = async (): Promise<Article[]> => {
  // return mock data em vez de fazer fetch
  return new Promise(resolve => setTimeout(() => resolve(mockArticles), 500)) // Simula loading
}

export const useArticles = () => {
  return useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  })
}
