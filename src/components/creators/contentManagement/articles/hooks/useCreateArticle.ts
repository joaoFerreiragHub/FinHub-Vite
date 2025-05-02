import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface NewArticle {
  title: string
  topic: string
  content: string
  imageUrl?: string
}

export const useCreateArticle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newArticle: NewArticle) => {
      const response = await axios.post("/api/articles", newArticle)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
    },
  })
}
