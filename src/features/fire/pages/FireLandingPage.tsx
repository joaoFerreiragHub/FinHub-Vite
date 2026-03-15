import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Target, Wallet2 } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@/components/ui'
import { FireToolNav } from '../components/FireToolNav'

const fireHighlights = [
  {
    title: 'Portfolio real',
    description:
      'Cria e gere o teu portfolio com holdings por ticker, alocacao mensal e contribuicao recorrente.',
    to: '/ferramentas/fire/portfolio',
    icon: Wallet2,
  },
  {
    title: 'Simulacao por cenarios',
    description:
      'Corre cenarios optimistic, base, conservative e bear para estimar tempo ate ao objetivo FIRE.',
    to: '/ferramentas/fire/simulador',
    icon: BarChart3,
  },
  {
    title: 'Dashboard de progresso',
    description:
      'Acompanha valor atual, gap para FIRE, composicao por ativo e principais sinais do teu plano.',
    to: '/ferramentas/fire/dashboard',
    icon: Target,
  },
]

export default function FireLandingPage() {
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 top-0 h-36 w-36 rounded-full bg-primary/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 right-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="relative z-10 space-y-5">
            <Badge variant="outline" className="bg-background/80">
              Ferramentas - FIRE
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Planeia independencia financeira com portfolio real e simulacao tecnica.
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Este modulo liga o backend de portfolio FIRE ja entregue: CRUD completo de holdings e
              simulacao por cenarios com horizonte configuravel.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/ferramentas/fire/portfolio">
                  Abrir portfolio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/ferramentas/fire/simulador">Ir para simulador</Link>
              </Button>
            </div>
            <FireToolNav />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fireHighlights.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.to}
                className="group border border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link to={item.to}>
                      Abrir
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
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
