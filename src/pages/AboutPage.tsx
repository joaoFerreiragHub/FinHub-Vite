import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, BookOpen, ShieldCheck, Users } from 'lucide-react'
import { Button } from '@/components/ui'

const pillars = [
  {
    icon: BookOpen,
    title: 'Literacia financeira pratica',
    description:
      'Transformamos conceitos de investimento em conteudo claro, atualizado e orientado para decisoes informadas.',
  },
  {
    icon: Users,
    title: 'Ecossistema de criadores',
    description:
      'Ligamos utilizadores a criadores com historico, contexto e formatos de conteudo variados: artigos, cursos, videos e mais.',
  },
  {
    icon: BarChart3,
    title: 'Ferramentas e dados',
    description:
      'Combinamos curadoria editorial e ferramentas de mercado para apoiar aprendizagem continua e acompanhamento diario.',
  },
  {
    icon: ShieldCheck,
    title: 'Responsabilidade e transparencia',
    description:
      'Mantemos controlos de moderacao, auditoria e avisos de risco para garantir uma experiencia segura e clara.',
  },
]

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Sobre
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            O FinHub existe para tornar investimento mais compreensivel e acessivel
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Somos uma plataforma de educacao financeira que combina criadores, conteudo e ferramentas
            de mercado num unico produto. O objetivo e simples: reduzir ruida, aumentar clareza e
            ajudar cada utilizador a evoluir com consistencia.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/explorar/tudo">
                Explorar conteudos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/criadores">Conhecer criadores</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <pillar.icon className="h-4 w-4" />
              </div>
              <h2 className="text-base font-semibold text-foreground">{pillar.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{pillar.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
