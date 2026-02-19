import { ArrowRight, BookOpen, CalendarClock, Newspaper, Wallet } from 'lucide-react'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { Button, Card, CardContent } from '@/components/ui'
import { MarketSubNav } from '@/pages/mercados/_components/MarketSubNav'

type ResourceCard = {
  title: string
  description: string
  href: string
  icon: typeof BookOpen
}

const resourceCards: ResourceCard[] = [
  {
    title: 'Noticias e contexto',
    description: 'Acede ao feed de noticias para acompanhar eventos e impacto no mercado.',
    href: '/mercados/noticias',
    icon: Newspaper,
  },
  {
    title: 'Conteudos para estudo',
    description: 'Artigos, cursos e videos para reforcar a tua base de analise.',
    href: '/hub/conteudos',
    icon: BookOpen,
  },
  {
    title: 'Ferramentas financeiras',
    description: 'Calculadoras e simuladores para validacao de cenarios e decisoes.',
    href: '/ferramentas',
    icon: Wallet,
  },
  {
    title: 'Agenda do mercado',
    description: 'Consulta noticias frequentes para mapear o que mexe com os ativos.',
    href: '/noticias',
    icon: CalendarClock,
  },
]

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Recursos de Mercado"
          subtitle="Ponto de partida para estudo continuo: contexto, conteudo e ferramentas."
          compact
          backgroundImage="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1800&q=80"
        />

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <MarketSubNav current="/mercados/recursos" />

            <div className="grid gap-5 md:grid-cols-2">
              {resourceCards.map((card) => {
                const Icon = card.icon
                return (
                  <Card
                    key={card.title}
                    className="group border border-border/60 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">{card.title}</h2>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                      <Button asChild variant="outline" className="w-full justify-between">
                        <a href={card.href}>
                          Abrir recurso
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </HomepageLayout>
  )
}

export default { Page }
