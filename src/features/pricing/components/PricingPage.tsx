import { useEffect, useMemo, useState } from 'react'
import { Check, Crown, Sparkles, UserPlus } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { cn } from '@/lib/utils'

type BillingCycle = 'monthly' | 'annual'
type PlanKey = 'free' | 'premium' | 'creator'

type PlanDefinition = {
  key: PlanKey
  name: string
  monthlyPrice: number
  description: string
  cta: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  highlighted?: boolean
  badge?: string
}

const DISCOUNT_FACTOR = 0.8

const PLANS: PlanDefinition[] = [
  {
    key: 'free',
    name: 'Free',
    monthlyPrice: 0,
    description: 'Acesso a criadores, artigos, podcasts e ferramentas basicas.',
    cta: 'Comecar gratis',
    icon: UserPlus,
    features: ['Acesso a criadores', 'Artigos e podcasts', 'Ferramentas basicas', 'Perfil pessoal'],
  },
  {
    key: 'premium',
    name: 'Premium',
    monthlyPrice: 9,
    description: 'Tudo do Free + cursos exclusivos, ferramentas avancadas e sem anuncios.',
    cta: 'Experimentar 7 dias',
    icon: Sparkles,
    features: [
      'Tudo do plano Free',
      'Cursos exclusivos',
      'FIRE e analise de stocks',
      'Sem anuncios',
    ],
    highlighted: true,
    badge: 'Mais popular',
  },
  {
    key: 'creator',
    name: 'Creator',
    monthlyPrice: 19,
    description: 'Tudo do Premium + publicar conteudo, dashboard criador e analytics.',
    cta: 'Tornar-me Criador',
    icon: Crown,
    features: [
      'Tudo do plano Premium',
      'Publicacao de conteudo',
      'Dashboard de criador',
      'Analytics de audiencia',
    ],
  },
]

const FEATURE_TABLE: Array<{
  label: string
  free: boolean
  premium: boolean
  creator: boolean
}> = [
  { label: 'Acesso a criadores e artigos', free: true, premium: true, creator: true },
  { label: 'Podcasts e videos educativos', free: true, premium: true, creator: true },
  { label: 'Ferramentas avancadas (FIRE, stocks)', free: false, premium: true, creator: true },
  { label: 'Cursos exclusivos', free: false, premium: true, creator: true },
  { label: 'Experiencia sem anuncios', free: false, premium: true, creator: true },
  { label: 'Publicar conteudo', free: false, premium: false, creator: true },
  { label: 'Dashboard de criador', free: false, premium: false, creator: true },
  { label: 'Analytics de crescimento', free: false, premium: false, creator: true },
]

const FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: 'Posso comecar gratis e mudar mais tarde?',
    answer:
      'Sim. Podes criar conta no plano Free e, quando quiseres, evoluir para Premium ou Creator.',
  },
  {
    question: 'O teste de 7 dias do Premium tem custo imediato?',
    answer:
      'Nao. O objetivo e experimentares as funcionalidades premium antes de decidires se queres manter.',
  },
  {
    question: 'O plano anual tem mesmo desconto?',
    answer:
      'Sim. No modo anual aplicamos 20% de desconto face ao valor mensal acumulado ao longo de 12 meses.',
  },
  {
    question: 'Qual a diferenca entre Premium e Creator?',
    answer:
      'Premium e para consumo de conteudo e ferramentas avancadas. Creator adiciona publicacao e analytics.',
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer:
      'Sim. Nao ha fidelizacao nesta fase. Podes ajustar o plano quando fizer sentido para o teu percurso.',
  },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function getAnnualTotal(monthlyPrice: number) {
  if (monthlyPrice === 0) return 0
  return Number((monthlyPrice * 12 * DISCOUNT_FACTOR).toFixed(2))
}

function getPlanCta(
  plan: PlanDefinition,
  mounted: boolean,
  isAuthenticated: boolean,
  role: UserRole | undefined,
) {
  const authReady = mounted && isAuthenticated
  if (!authReady) {
    return { href: '/registar', label: plan.cta }
  }

  if (plan.key === 'free') {
    return { href: '/feed', label: 'Ir para o feed' }
  }

  if (plan.key === 'premium') {
    if (
      role === UserRole.PREMIUM ||
      role === UserRole.CREATOR ||
      role === UserRole.ADMIN ||
      role === UserRole.BRAND_MANAGER
    ) {
      return { href: '/ferramentas', label: 'Explorar Premium' }
    }
    return { href: '/perfil', label: 'Experimentar 7 dias' }
  }

  if (role === UserRole.CREATOR || role === UserRole.ADMIN) {
    return { href: '/creators/dashboard', label: 'Abrir dashboard criador' }
  }

  return { href: '/creators', label: 'Tornar-me Criador' }
}

function renderFeatureAvailability(value: boolean) {
  if (!value) {
    return <span className="text-muted-foreground">-</span>
  }
  return (
    <span className="inline-flex items-center justify-center text-emerald-500">
      <Check className="h-4 w-4" />
    </span>
  )
}

export function PricingPage() {
  const { isAuthenticated, user } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleLabel = billingCycle === 'monthly' ? '/mes' : '/ano'

  const pricingSummary = useMemo(() => {
    return PLANS.map((plan) => {
      const monthly = plan.monthlyPrice
      const annualTotal = getAnnualTotal(monthly)
      const priceValue = billingCycle === 'monthly' ? monthly : annualTotal
      const cta = getPlanCta(plan, mounted, isAuthenticated, user?.role)
      return {
        plan,
        cta,
        priceText: formatPrice(priceValue),
        annualMonthlyEquivalent:
          billingCycle === 'annual' && monthly > 0
            ? formatPrice(Number((annualTotal / 12).toFixed(2)))
            : null,
      }
    })
  }, [billingCycle, isAuthenticated, mounted, user?.role])

  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-12">
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            Planos FinHub
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Comeca gratuitamente. Cresce sem limites.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Escolhe o plano certo para a tua jornada financeira. Evolui do primeiro investimento ate
            a criacao de conteudo premium.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          {pricingSummary.map(({ plan, cta, priceText, annualMonthlyEquivalent }) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.key}
                className={cn(
                  'relative flex h-full flex-col border-border/70 shadow-sm transition-colors',
                  plan.highlighted ? 'ring-2 ring-primary' : '',
                )}
              >
                {plan.badge ? (
                  <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                ) : null}
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary">
                    <Icon className="h-5 w-5" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6">
                  <div>
                    <p className="text-3xl font-bold tabular-nums">
                      {priceText}
                      <span className="ml-1 text-base font-medium text-muted-foreground">
                        {cycleLabel}
                      </span>
                    </p>
                    {annualMonthlyEquivalent ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Equivalente a {annualMonthlyEquivalent}/mes no plano anual.
                      </p>
                    ) : null}
                  </div>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-auto w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    <a href={cta.href}>{cta.label}</a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Compara os planos</h2>
            <p className="text-sm text-muted-foreground">
              Alterna entre mensal e anual. O plano anual aplica 20% de desconto.
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-border/70 p-1">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('monthly')}
            >
              Mensal
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('annual')}
              className="gap-2"
            >
              Anual
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                -20%
              </Badge>
            </Button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-center font-semibold">Free</th>
                <th className="px-4 py-3 text-center font-semibold">Premium</th>
                <th className="px-4 py-3 text-center font-semibold">Creator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border/60 bg-background/70">
                <td className="px-4 py-3 font-medium">
                  Preco ({billingCycle === 'monthly' ? 'mensal' : 'anual'})
                </td>
                <td className="px-4 py-3 text-center tabular-nums">
                  {formatPrice(billingCycle === 'monthly' ? 0 : getAnnualTotal(0))}
                </td>
                <td className="px-4 py-3 text-center tabular-nums">
                  {formatPrice(billingCycle === 'monthly' ? 9 : getAnnualTotal(9))}
                </td>
                <td className="px-4 py-3 text-center tabular-nums">
                  {formatPrice(billingCycle === 'monthly' ? 19 : getAnnualTotal(19))}
                </td>
              </tr>
              {FEATURE_TABLE.map((row) => (
                <tr key={row.label} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{row.label}</td>
                  <td className="px-4 py-3 text-center">{renderFeatureAvailability(row.free)}</td>
                  <td className="px-4 py-3 text-center">
                    {renderFeatureAvailability(row.premium)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {renderFeatureAvailability(row.creator)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-12">
        <h2 className="text-2xl font-bold tracking-tight">Perguntas frequentes</h2>
        <div className="mt-4 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="rounded-lg border border-border/70 bg-card/40 p-4"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-3 px-4 py-10 sm:px-6 lg:px-12">
          <h2 className="text-2xl font-bold tracking-tight">Ainda tens duvidas? Fala connosco.</h2>
          <p className="text-sm text-muted-foreground">
            A equipa FinHub ajuda-te a escolher o plano ideal para o teu momento.
          </p>
          <Button asChild variant="outline">
            <a href="/contacto">Ir para contacto</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
