import { useEffect, useState } from "react"
import ArticleList from "./ArticleList"
import ArticleEditorModal from "./ArticleEditorModal"
import ArticleVisibilityToggle from "./ArticleVisibilityToggle"
import ArticleDeleteConfirm from "./ArticleDeleteConfirm"
import { Button } from "../../../ui/button"
import { toast } from "react-toastify"
// import { useArticles } from "./hooks/useArticles"
// import { useDeleteArticle } from "./hooks/useDeleteArticle"
import { useToggleArticleVisibility } from "./hooks/useArticleVisibility"
import { Article } from "../../../../types/article"
import { mockArticles } from "../../../../mock/mockArticles"


export default function ArticleManagementPage() {
  // Substituir hook por mock:
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isLoading] = useState(false)
  // const deleteArticleMutation = useDeleteArticle()
  const toggleVisibilityMutation = useToggleArticleVisibility()
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
const [selectedTab, setSelectedTab] = useState<"todos" | "mais-vistos" | "menos-vistos" | "escondidos">("todos")

  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setShowEditor(true)
  }

  useEffect(() => {
    // Adiciona a propriedade `hidden` aos artigos mock (se ainda não existir)
    setArticles(mockArticles.map(article => ({ ...article, hidden: false })))
  }, [])


  const handleToggleArticleVisibility = (id: string) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === id ? { ...article, hidden: !article.hidden } : article
      )
    )
  }


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
const filteredArticles = articles.filter(article => {
  if (selectedTab === "escondidos") return article.hidden
  if (selectedTab === "mais-vistos") return article.views > 0
  if (selectedTab === "menos-vistos") return article.views === 0
  return true // "todos"
})
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
      <div className="flex gap-4 border-b pb-2">
        <button onClick={() => setSelectedTab("todos")} className={selectedTab === "todos" ? "font-bold" : ""}>Todos</button>
        <button onClick={() => setSelectedTab("mais-vistos")} className={selectedTab === "mais-vistos" ? "font-bold" : ""}>Mais vistos</button>
        <button onClick={() => setSelectedTab("menos-vistos")} className={selectedTab === "menos-vistos" ? "font-bold" : ""}>Menos vistos</button>
        <button onClick={() => setSelectedTab("escondidos")} className={selectedTab === "escondidos" ? "font-bold" : ""}>Escondidos</button>
      </div>

      <ArticleList
        articles={filteredArticles}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleArticleVisibility}
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
