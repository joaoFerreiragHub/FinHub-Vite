import { ArrowRight, BarChart3, Calculator, TrendingUp, Wrench } from 'lucide-react'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { Badge, Button, Card, CardContent } from '@/components/ui'

const standaloneTools = [
  'Calculadora de Juros Compostos',
  'Simulador de Investimentos',
  'Calculadora de Aposentadoria',
  'ROI Calculator',
  'Budget Planner',
  'Comparador de Investimentos',
]

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Ferramentas Financeiras"
          subtitle="Um espaco dedicado a diagnostico financeiro pessoal e a ferramentas praticas para decisoes do dia a dia."
          compact
          backgroundImage="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1800&q=80"
        />

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
            <Card className="group overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/8 to-background transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Raio-X Financeiro
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Wizard inicial para tirar uma fotografia rapida da saude financeira do utilizador.
                  Comeca com diagnostico base e depois evolui para inputs mais detalhados.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/40 bg-primary/10">
                    Diagnostico Base
                  </Badge>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10">
                    Score Inicial
                  </Badge>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10">
                    Plano de Melhorias
                  </Badge>
                </div>

                <Button asChild className="mt-6 w-full justify-between">
                  <a href="/ferramentas/raio-x">
                    Abrir Raio-X
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border border-border/60 bg-card/70 transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/70 text-foreground">
                  <Wrench className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Ferramentas Avulsas
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Acesso direto a calculadoras e simuladores, sem passar por wizard. Ideal para
                  consultas rapidas e analises pontuais.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {standaloneTools.map((tool) => (
                    <div
                      key={tool}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-xs text-foreground"
                    >
                      <Calculator className="h-3.5 w-3.5 text-primary" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>

                <Button asChild variant="outline" className="mt-6 w-full justify-between">
                  <a href="/ferramentas/calculadoras">
                    Ver Ferramentas
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 pb-16">
          <div className="mx-auto max-w-6xl rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-7 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Estado atual</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              O Raio-X e as ferramentas avulsas ja estao funcionais com o mesmo motor de calculo. A
              proxima iteracao foca persistencia por utilizador e historico de simulacoes.
            </p>
          </div>
        </section>
      </div>
    </HomepageLayout>
  )
}

export default { Page }
