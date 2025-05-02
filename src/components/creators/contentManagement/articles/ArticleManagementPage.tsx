import { useEffect, useState } from "react"
import ArticleList from "./ArticleList"
import ArticleEditorModal from "./ArticleEditorModal"
import ArticleVisibilityToggle from "./ArticleVisibilityToggle"
import ArticleDeleteConfirm from "./ArticleDeleteConfirm"
import { Button } from "../../../ui/button"
import { toast } from "react-toastify"
// import { useArticles } from "./hooks/useArticles"
import { useDeleteArticle } from "./hooks/useDeleteArticle"
import { useToggleArticleVisibility } from "./hooks/useArticleVisibility"
import { Article } from "../../../../types/article"
import { mockArticles } from "../../../../mock/mockArticles"


export default function ArticleManagementPage() {
  // Substituir hook por mock:
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isLoading, setIsLoading] = useState(false)
  const deleteArticleMutation = useDeleteArticle()
  const toggleVisibilityMutation = useToggleArticleVisibility()
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)

  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setShowEditor(true)
  }
useEffect(() => {
    // Garantir que o estado no cliente é consistente
    setArticles(mockArticles)
  }, [])
  console.log("articles", articles)

  const handleDeleteConfirm = async () => {
    if (articleToDelete) {
      try {
        // Temporário: remove do estado mock
        setArticles(prev => prev.filter(a => a.id !== articleToDelete))
        toast.success("Artigo apagado com sucesso!")
      } catch {
        toast.error("Erro ao apagar o artigo.")
      } finally {
        setArticleToDelete(null)
      }
    }
  }

  const handleDelete = (id: string) => {
    setArticleToDelete(id)
  }

  const handleToggleVisibility = async () => {
    try {
      const newVisibility = !isVisible
      await toggleVisibilityMutation.mutateAsync(newVisibility)
      setIsVisible(newVisibility)
      toast.success("Visibilidade atualizada!")
    } catch {
      toast.error("Erro ao atualizar visibilidade.")
    }
  }

  const handleEditorSuccess = () => {
    setShowEditor(false)
    setEditingArticle(null)
    // Podes atualizar o mockArticles se quiseres ver alterações.
  }

  const articleTitleToDelete = articles.find(a => a.id === articleToDelete)?.title || ""

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestão de Artigos</h1>
        <Button onClick={() => { setShowEditor(true); setEditingArticle(null) }}>
          Novo Artigo
        </Button>
      </div>

      <ArticleVisibilityToggle isVisible={isVisible} onToggle={handleToggleVisibility} />

      <ArticleList
        articles={articles}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showEditor && (
        <ArticleEditorModal
          initialData={editingArticle ?? undefined}
          onClose={() => setShowEditor(false)}
          onSuccess={handleEditorSuccess}
        />
      )}

      {articleToDelete && (
        <ArticleDeleteConfirm
          open={!!articleToDelete}
          onClose={() => setArticleToDelete(null)}
          onConfirm={handleDeleteConfirm}
          articleTitle={articleTitleToDelete}
        />
      )}
    </div>
  )
}
