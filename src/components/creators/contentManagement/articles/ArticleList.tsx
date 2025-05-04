import { Article } from "../../../../types/article"
import ArticleCard from "./ArticleCard"
import ArticleSkeleton from "./ArticleSkeleton"

interface ArticleListProps {
  articles: Article[]
  isLoading: boolean
  onEdit: (article: Article) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string) => void
}

export default function ArticleList({
  articles,
  isLoading,
  onEdit,
  onDelete,
  onToggleVisibility,
}: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onEdit={() => onEdit(article)}
          onDelete={() => onDelete(article.id)}
          onToggleVisibility={() => onToggleVisibility(article.id)}
        />
      ))}
    </div>
  )
}
