import { Article } from "../../../../types/article"
import { Button } from "../../../ui/button"

interface ArticleCardProps {
  article: Article
  onEdit: () => void
  onDelete: () => void
}

export default function ArticleCard({ article, onEdit, onDelete }: ArticleCardProps) {
  const previewContent =
    article.content.length > 100 ? article.content.slice(0, 100) + "..." : article.content

  return (
    <div className="border border-border rounded-lg p-4 shadow-sm bg-card">
      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover rounded mb-3" />
      )}
      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{previewContent}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onEdit}>Editar</Button>
        <Button variant="destructive" onClick={onDelete}>Apagar</Button>
      </div>
    </div>
  )
}
