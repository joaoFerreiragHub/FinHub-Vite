import { GraduationCap, Newspaper, Users, Wrench } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { useOnboarding } from '../hooks/useOnboarding'

const DISCOVERY_SECTIONS = [
  {
    title: 'Criadores',
    description: 'Descobre especialistas e acompanha quem fala a tua lingua financeira.',
    icon: Users,
  },
  {
    title: 'Cursos',
    description: 'Aprende com percursos praticos de investimento e literacia.',
    icon: GraduationCap,
  },
  {
    title: 'Noticias',
    description: 'Segue os acontecimentos que mexem com mercados e economia.',
    icon: Newspaper,
  },
  {
    title: 'Ferramentas',
    description: 'Analisa ativos e explora simuladores para decidir com contexto.',
    icon: Wrench,
  },
] as const

const TOPICS = [
  'Investimentos',
  'Financas Pessoais',
  'Cripto',
  'FIRE',
  'ETFs',
  'Acoes',
  'Imobiliario',
] as const

export function OnboardingOverlay() {
  const { show, step, next, skip, complete, selectedTopics, toggleTopic } = useOnboarding()
  const canComplete = selectedTopics.length > 0

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-background/85 px-4 py-6 backdrop-blur-sm">
      <Card className="w-full max-w-3xl border-border/70 shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Primeiros passos no FinHub</CardTitle>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Passo {step} de 3
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className={cn(
                  'h-2.5 flex-1 rounded-full transition-colors',
                  item <= step ? 'bg-primary' : 'bg-muted',
                )}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 ? (
            <section className="space-y-3">
              <h3 className="text-2xl font-semibold tracking-tight">Bem-vindo ao FinHub</h3>
              <CardDescription className="text-base">
                A plataforma #1 de literacia financeira em Portugal.
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                Vamos configurar a tua experiencia em menos de um minuto.
              </p>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight">Descobrir conteudo</h3>
              <CardDescription className="text-base">
                Explora as principais secoes da plataforma.
              </CardDescription>
              <div className="grid gap-3 sm:grid-cols-2">
                {DISCOVERY_SECTIONS.map((section) => {
                  const Icon = section.icon
                  return (
                    <div
                      key={section.title}
                      className="rounded-lg border border-border bg-card/60 p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="rounded-md bg-primary/15 p-2 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{section.title}</p>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight">Personalizar</h3>
              <CardDescription className="text-base">
                Escolhe os teus topicos de interesse.
              </CardDescription>
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPICS.map((topic) => {
                  const checked = selectedTopics.includes(topic)
                  return (
                    <label
                      key={topic}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm text-foreground"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) => {
                          if (value === true && !checked) {
                            toggleTopic(topic)
                          }
                          if (value !== true && checked) {
                            toggleTopic(topic)
                          }
                        }}
                      />
                      {topic}
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Seleciona pelo menos 1 topico para concluir.
              </p>
            </section>
          ) : null}

          <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              {step >= 2 ? (
                <Button variant="ghost" onClick={skip}>
                  Pular
                </Button>
              ) : null}
            </div>
            {step < 3 ? (
              <Button onClick={next}>{step === 1 ? 'Comecar' : 'Continuar'}</Button>
            ) : (
              <Button onClick={complete} disabled={!canComplete}>
                Concluir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
