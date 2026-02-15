import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { RatingDisplay } from '@/features/hub/components/ratings/RatingDisplay'
import { Article, ArticleWithRatings } from '@/features/creators/types/content'
import { Card, CardContent } from '@/components/ui'

interface ArticlesSectionProps {
  articles: Article[]
  onArticleClick: (article: Article) => void
  articlesWithRatings: ArticleWithRatings[]
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  onArticleClick,
  articlesWithRatings,
}) => {
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})
  const { user } = useAuthStore()
  const userId = user?.id

  useEffect(() => {
    const fetchUserRatingsForArticles = async () => {
      const ratings: Record<string, number> = {}

      for (const article of articlesWithRatings) {
        try {
          const res = await axios.get<{ rating: number }>(
            `${import.meta.env.VITE_API_URL}ratings/article/${article.id}/user/${userId}`,
          )
          ratings[article.id] = res.data.rating ?? 0
        } catch (error) {
          console.error(`Erro ao buscar avaliação do artigo ${article.id}:`, error)
        }
      }

      setUserRatings(ratings)
    }

    if (userId && articlesWithRatings.length > 0) {
      fetchUserRatingsForArticles()
    }
  }, [articlesWithRatings, userId])

  return (
    <section className="mt-10 space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Artigos</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {articlesWithRatings.map((article) => {
          const userRating = userRatings[article.id]
          const averageRating = article.averageRating ?? 0
          const imageSrc = article.bannerImage || '/assets/serriquinho.jpg'

          return (
            <Card
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="cursor-pointer hover:shadow-lg transition duration-300"
            >
              <img
                src={imageSrc}
                alt={article.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>

                <div className="text-sm text-muted-foreground space-y-2 text-center">
                  <div>
                    <p className="font-medium">Média de Avaliações</p>
                    <RatingDisplay rating={averageRating} />
                    <p>{averageRating.toFixed(1)}/5</p>
                  </div>

                  {userRating !== undefined && (
                    <div>
                      <p className="font-medium">A tua Avaliação</p>
                      <RatingDisplay rating={userRating} />
                      <p>{userRating.toFixed(1)}/5</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default ArticlesSection
