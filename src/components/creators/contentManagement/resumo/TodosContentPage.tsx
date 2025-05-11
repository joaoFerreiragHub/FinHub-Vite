// TodosContentPage.tsx
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../ui/tabs"
import { mockPlaylists } from "../../../../mock/mockPlaylists"
import { mockPodcasts } from "../../../../mock/mockPodcasts"
import { mockReels } from "../../../../mock/mockReels"
import { mockArticles } from "../../../../mock/mockArticles"
import { mockCourses } from "../../../../mock/mockCourses"
import { User } from "../../../../stores/useUserStore"

interface TodosContentPageProps {
  user: User // Ou o tipo correto se tiveres um tipo específico
}

export default function TodosContentPage({ user }: TodosContentPageProps) {
  const [tab, setTab] = useState("resumo")


  const contentSummary = [
    { type: "Reels", count: mockReels.length, path: "/creators/conteudos/reels" },
    { type: "Artigos", count: mockArticles.length, path: "/creators/conteudos/artigos" },
    { type: "Cursos", count: mockCourses.length, path: "/creators/conteudos/cursos" },
    { type: "Podcasts", count: mockPodcasts.length, path: "/creators/conteudos/podcasts" },
    { type: "Playlists", count: mockPlaylists.length, path: "/creators/conteudos/playlists" },
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
                        if (typeof window !== "undefined") {
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
            <p className="text-muted-foreground text-sm">Em breve: lista completa e pesquisável de todos os conteúdos.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
