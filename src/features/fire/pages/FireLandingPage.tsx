import { ArrowRight, BarChart3, LineChart, Wallet2 } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { FireToolNav } from '../components/FireToolNav'

const fireHighlights = [
  {
    title: 'Portfolio FIRE',
    description: 'Gere carteiras com ETFs e acoes dividendeiras.',
    icon: Wallet2,
  },
  {
    title: 'Simulador por cenarios',
    description: 'Base, otimista, conservador e bear - compara trajetorias.',
    icon: BarChart3,
  },
  {
    title: 'Dashboard em tempo real',
    description: 'Progresso, taxa de retirada e Monte Carlo num relance.',
    icon: LineChart,
  },
]

export default function FireLandingPage() {
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/20 via-card to-background p-6 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-12 h-48 w-48 rounded-full bg-emerald-600/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl"
          />

          <div className="relative z-10 space-y-5">
            <Badge variant="outline" className="bg-background/80">
              Ferramentas Hub - FIRE
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Reforma-te mais cedo. Simula o teu caminho FIRE.
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              FIRE significa Financial Independence, Retire Early: construi rendimento passivo para
              decidir quando e como trabalhas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="/ferramentas/fire/dashboard">
                  Ver o meu Dashboard
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/ferramentas/fire/simulador">Simular agora</a>
              </Button>
            </div>
            <FireToolNav />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {fireHighlights.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.title}
                className="group border border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardHeader className="space-y-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 pt-0">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Metodo por despesas vs. Rendimento passivo</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/70">
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Comparacao</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Metodo por despesas
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Rendimento passivo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 text-muted-foreground">Objetivo principal</td>
                  <td className="px-3 py-2 text-foreground">Cobrir despesas anuais</td>
                  <td className="px-3 py-2 text-foreground">Gerar cashflow mensal estavel</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 text-muted-foreground">Formula base</td>
                  <td className="px-3 py-2 text-foreground">Despesas x 12 / taxa de retirada</td>
                  <td className="px-3 py-2 text-foreground">Rendimento alvo / yield estimada</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Foco da carteira</td>
                  <td className="px-3 py-2 text-foreground">Crescimento + resiliencia</td>
                  <td className="px-3 py-2 text-foreground">Dividendos e fluxos recorrentes</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Comeca gratuitamente</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cria o teu portfolio FIRE e acompanha o progresso a partir de hoje.
              </p>
            </div>
            <Button asChild size="lg">
              <a href="/ferramentas/fire/portfolio">
                Comeca gratuitamente
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
