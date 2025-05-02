import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const useToggleArticleVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (visible: boolean) => {
      await axios.patch(`/api/articles/visibility`, { isVisible: visible })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles-visibility"] })
    },
  })
}
