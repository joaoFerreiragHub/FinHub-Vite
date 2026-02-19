import { ArrowRight, BarChart3, Coins, LandPlot, ListPlus, Waypoints } from 'lucide-react'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { MarketsNav } from '@/features/markets/components/MarketsNav'

const marketModules = [
  {
    title: 'Analise de Acoes',
    description:
      'Pesquisa por ticker, indicadores, peers e analise detalhada para estudar empresas.',
    to: '/mercados/acoes',
    status: 'ativo',
    icon: BarChart3,
  },
  {
    title: 'Comparador de ETFs',
    description: 'Compara sobreposicao de holdings e overlap setorial entre dois ETFs.',
    to: '/mercados/etfs',
    status: 'ativo',
    icon: Waypoints,
  },
  {
    title: 'REITs Toolkit',
    description: 'Inicio da migracao das ferramentas REIT: DDM, FFO e NAV num fluxo unico.',
    to: '/mercados/reits',
    status: 'ativo',
    icon: LandPlot,
  },
  {
    title: 'Lista de Cripto',
    description: 'Painel com criptomoedas, preco e market cap para acompanhamento rapido.',
    to: '/mercados/cripto',
    status: 'ativo',
    icon: Coins,
  },
  {
    title: 'Watchlist',
    description:
      'Area dedicada para lista de tickers observados. Integracao backend entra na proxima fase.',
    to: '/mercados/watchlist',
    status: 'em migracao',
    icon: ListPlus,
  },
]

export default function MarketsHubPage() {
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 right-0 h-44 w-44 rounded-full bg-primary/15 blur-3xl"
          />

          <div className="relative z-10 space-y-5">
            <Badge variant="outline" className="bg-background/80">
              Tab Mercados
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ferramentas de estudo e analise de mercado num unico lugar.
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Esta area vai receber toda a migracao das ferramentas antigas: acoes, ETFs, REITs,
              cripto e watchlist, por fases, mantendo estabilidade e layout consistente.
            </p>
            <MarketsNav />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {marketModules.map((module) => {
            const Icon = module.icon
            return (
              <Card
                key={module.title}
                className="group border border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={module.status === 'ativo' ? 'default' : 'secondary'}>
                      {module.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">{module.title}</h2>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <a href={module.to}>
                      Abrir modulo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </section>
      </div>
    </div>
  )
}
