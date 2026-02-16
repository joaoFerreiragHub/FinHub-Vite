// TodosContentPage.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { mockPlaylists } from '@/lib/mock/mockPlaylists'
import { mockPodcasts } from '@/lib/mock/mockPodcasts'
import { mockReels } from '@/lib/mock/mockReels'
import { mockArticles } from '@/lib/mock/mockArticles'
import { mockCourses } from '@/lib/mock/mockCourses'
import type { User } from '@/features/auth/types'

interface TodosContentPageProps {
  user: User // Ou o tipo correto se tiveres um tipo específico
}

export default function TodosContentPage({ user }: TodosContentPageProps) {
  const [tab, setTab] = useState('resumo')

  const contentSummary = [
    { type: 'Reels', count: mockReels.length, path: '/creators/dashboard/reels' },
    { type: 'Artigos', count: mockArticles.length, path: '/creators/dashboard/articles' },
    { type: 'Cursos', count: mockCourses.length, path: '/creators/dashboard/courses' },
    { type: 'Podcasts', count: mockPodcasts.length, path: '/creators/dashboard/podcasts' },
    { type: 'Playlists', count: mockPlaylists.length, path: '/creators/dashboard/playlists' },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex gap-2">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="lista">Lista Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contentSummary.map((item) => (
              <Card key={item.type} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{item.type}</CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = `${item.path}?userId=${user.id}`
                        }
                      }}
                    >
                      Criar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{item.count}</p>
                  <p className="text-sm text-muted-foreground">total criado(s)</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lista">
          <div className="space-y-4">
            {/* Aqui podemos futuramente unificar os conteúdos num feed ordenável por tipo/data */}
            <p className="text-muted-foreground text-sm">
              Em breve: lista completa e pesquisável de todos os conteúdos.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
