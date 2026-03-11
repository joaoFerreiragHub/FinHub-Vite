import {
  ArrowRight,
  BarChart3,
  Coins,
  Compass,
  LandPlot,
  ListPlus,
  Newspaper,
  TrendingUp,
  Waypoints,
} from 'lucide-react'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { Button, Card, CardContent } from '@/components/ui'
import { MarketSubNav } from '@/pages/mercados/_components/MarketSubNav'

const marketModules = [
  {
    title: 'Analise de Acoes',
    description:
      'Pesquisa por ticker, consulta indicadores e compara empresas para estudar oportunidades.',
    href: '/mercados/acoes',
    icon: TrendingUp,
  },
  {
    title: 'Noticias de Mercado',
    description:
      'Acompanha eventos, sentimento e headlines para contextualizar movimentos do mercado.',
    href: '/mercados/noticias',
    icon: Newspaper,
  },
  {
    title: 'Comparador de ETFs',
    description:
      'Compara holdings e overlap setorial entre dois ETFs para evitar duplicacao de exposicao.',
    href: '/mercados/etfs',
    icon: Waypoints,
  },
  {
    title: 'REITs Toolkit',
    description: 'Ferramentas de avaliacao REIT com DDM, FFO e NAV no mesmo fluxo de analise.',
    href: '/mercados/reits',
    icon: LandPlot,
  },
  {
    title: 'Lista de Cripto',
    description: 'Painel de acompanhamento de criptomoedas com pesquisa rapida por nome e simbolo.',
    href: '/mercados/cripto',
    icon: Coins,
  },
  {
    title: 'Watchlist',
    description:
      'Guarda tickers observados para voltar rapidamente aos ativos que queres acompanhar.',
    href: '/mercados/watchlist',
    icon: ListPlus,
  },
  {
    title: 'Recursos para Estudo',
    description:
      'Corretoras, plataformas e fontes para aprofundar analise e acompanhamento do mercado.',
    href: '/mercados/recursos',
    icon: Compass,
  },
]

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Mercados"
          subtitle="Tudo o que envolve estudo e analise de mercado fica centralizado nesta area."
          compact
          backgroundImage="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1800&q=80"
        />

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <MarketSubNav current="/mercados" />
            </div>

            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Hub de analise e monitorizacao de mercado
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {marketModules.map((module) => {
                const Icon = module.icon
                return (
                  <Card
                    key={module.title}
                    className="group border border-border/60 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">{module.title}</h2>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                      <Button asChild variant="outline" className="w-full justify-between">
                        <a href={module.href}>
                          Abrir modulo
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
