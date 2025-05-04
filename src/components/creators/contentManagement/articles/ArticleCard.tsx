import { Article } from "../../../../types/article"
import { Button } from "../../../ui/button"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

interface ArticleCardProps {
  article: Article
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}

export default function ArticleCard({ article, onEdit, onDelete, onToggleVisibility }: ArticleCardProps) {
  const previewContent =
    article.content.length > 100 ? article.content.slice(0, 100) + "..." : article.content

  return (
    <div className="border border-border rounded-lg p-4 shadow-sm bg-card">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <h3 className="text-lg font-semibold mb-1">{article.title}</h3>

      <p className="text-sm text-muted-foreground mb-2">{previewContent}</p>

      <div className="text-xs text-muted-foreground mb-4 space-y-1">
        <p>🧑 Autor: {article.author}</p>
        <p>📅 Criado em: {format(new Date(article.createdAt), "dd MMM yyyy", { locale: pt })}</p>
        <p>👁️ {article.views} visualizações • ❤️ {article.likes} likes(s)</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onToggleVisibility}>
          {article.hidden ? "Mostrar" : "Ocultar"}
        </Button>
        <Button variant="secondary" onClick={onEdit}>Editar</Button>
        <Button variant="destructive" onClick={onDelete}>Apagar</Button>
      </div>
    </div>
  )
}
