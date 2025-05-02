import { Article } from "../../../../types/article"
import { Button } from "../../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"


interface ArticlePreviewCardProps {
  article: Article
}

export default function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  const previewText = article.content.length > 150 ? article.content.slice(0, 150) + "..." : article.content

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover rounded mb-3" />
        )}
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{previewText}</p>
        <Button variant="link" className="mt-auto" asChild>
          <a href={`/artigos/${article.id}`}>Ler Mais</a>
        </Button>
      </CardContent>
    </Card>
  )
}
