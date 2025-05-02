import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Article } from "../../../../../types/content"


interface EditArticle {
  id: string
  updatedData: Partial<Article>
}

export const useEditArticle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updatedData }: EditArticle) => {
      const response = await axios.put(`/api/articles/${id}`, updatedData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
    },
  })
}
