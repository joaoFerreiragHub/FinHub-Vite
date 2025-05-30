import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card"

const levels = [
  { level: 1, title: "Iniciante", requirements: "Conta verificada", access: "Reels, Ficheiros" },
  { level: 2, title: "Ativo", requirements: "3 conteúdos + 50 visualizações", access: "Artigos, Podcasts, Estatísticas" },
  { level: 3, title: "Crescente", requirements: "10 conteúdos + 300 visualizações", access: "Cursos, Vídeos" },
  { level: 4, title: "Avançado", requirements: "30 conteúdos + 1000 visualizações + 20 interações", access: "Publicidade, Lives" },
  { level: 5, title: "Destaque", requirements: "Engajamento positivo contínuo", access: "Relatórios completos, promoções" },
]

export default function LevelAccessInfo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {levels.map((lvl) => (
        <Card key={lvl.level}>
          <CardHeader>
            <CardTitle>Nível {lvl.level} - {lvl.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p><strong>Requisitos:</strong> {lvl.requirements}</p>
            <p><strong>Acesso:</strong> {lvl.access}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
