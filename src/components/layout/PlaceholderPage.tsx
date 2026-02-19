import { Link } from 'react-router-dom'
import { ArrowRight, Compass, LayoutTemplate, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'

type QuickLink = {
  label: string
  to: string
}

interface PlaceholderPageProps {
  section?: string
  title: string
  description?: string
  primaryAction?: QuickLink
  secondaryAction?: QuickLink
  quickLinks?: QuickLink[]
}

const defaultQuickLinks: QuickLink[] = [
  { label: 'Explorar conteudos', to: '/explorar/tudo' },
  { label: 'Ver criadores', to: '/criadores' },
  { label: 'Aceder a recursos', to: '/recursos' },
]

export function PlaceholderPage({
  section = 'FinHub',
  title,
  description = 'Estamos a alinhar esta pagina com o mesmo padrao visual e de navegacao da Home.',
  primaryAction = { label: 'Voltar a Home', to: '/' },
  secondaryAction = { label: 'Explorar', to: '/explorar/tudo' },
  quickLinks = defaultQuickLinks,
}: PlaceholderPageProps) {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-6 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-40 w-40 -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/15 blur-3xl"
          />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {section}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild>
                <Link to={primaryAction.to}>
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={secondaryAction.to}>{secondaryAction.label}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <LayoutTemplate className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-foreground">UI consistente</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Esta area usa o mesmo sistema visual da Home: tipografia, espacamento, contraste e
              hierarquia.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Compass className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Navegacao previsivel</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              O foco aqui e reduzir friccao: atalhos claros, estados ativos e comportamento
              responsivo.
            </p>
          </article>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Acessos rapidos
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <Button
                key={link.to}
                asChild
                variant="ghost"
                className="h-9 rounded-lg border border-border px-3"
              >
                <Link to={link.to}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
