import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  Mic,
  Radio,
  Video,
  Play,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { HomepageLayout } from '@/components/home/HomepageLayout'

type ContentSection = {
  title: string
  description: string
  href: string
  icon: LucideIcon
  gradient: string
  emoji: string
  count?: string
  image: string
}

const featured: ContentSection[] = [
  {
    title: 'Livros',
    description: 'Recomendações e resumos para aprofundar conhecimento financeiro.',
    href: '/hub/conteudos/livros',
    icon: BookOpen,
    gradient: 'from-amber-600/80 to-orange-700/80',
    emoji: '📚',
    count: '50+ livros',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
  },
  {
    title: 'Reels',
    description: 'Conteúdos curtos para aprendizagem rápida e objetiva.',
    href: '/hub/conteudos/reels',
    icon: Play,
    gradient: 'from-fuchsia-600/80 to-pink-700/80',
    emoji: '⚡',
    count: '300+ reels',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
  },
  {
    title: 'Podcasts',
    description: 'Conteúdo em áudio para aprenderes em qualquer momento.',
    href: '/hub/conteudos/podcasts',
    icon: Mic,
    gradient: 'from-green-600/80 to-emerald-700/80',
    emoji: '🎙️',
    count: '80+ episódios',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
  },
]

const explore: ContentSection[] = [
  {
    title: 'Artigos',
    description: 'Análises, opiniões e guias práticos sobre finanças e mercados.',
    href: '/hub/conteudos/artigos',
    icon: FileText,
    gradient: 'from-blue-600 to-cyan-500',
    emoji: '📰',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=70',
  },
  {
    title: 'Cursos',
    description: 'Formação estruturada para evoluíres do básico ao avançado.',
    href: '/hub/conteudos/cursos',
    icon: GraduationCap,
    gradient: 'from-violet-600 to-purple-500',
    emoji: '🎓',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=70',
  },
  {
    title: 'Vídeos',
    description: 'Aulas e explicações visuais para temas mais técnicos.',
    href: '/hub/conteudos/videos',
    icon: Video,
    gradient: 'from-red-600 to-orange-500',
    emoji: '🎬',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=70',
  },
  {
    title: 'Eventos',
    description: 'Sessões e encontros para acompanhar temas em destaque.',
    href: '/hub/conteudos/eventos',
    icon: CalendarDays,
    gradient: 'from-pink-600 to-rose-500',
    emoji: '📅',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70',
  },
  {
    title: 'Lives',
    description: 'Transmissões em direto com criadores e especialistas.',
    href: '/hub/conteudos/lives',
    icon: Radio,
    gradient: 'from-teal-600 to-cyan-500',
    emoji: '🔴',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=70',
  },
]

export function Page() {
  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
          <div className="relative px-4 sm:px-6 md:px-10 lg:px-12 pt-16 pb-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                <Sparkles className="h-4 w-4" />
                Explora e aprende
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Descobre o teu formato ideal
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Artigos, cursos, vídeos, podcasts e muito mais. Escolhe como queres aprender sobre
                finanças e investimentos.
              </p>
            </div>
          </div>
        </div>

        {/* Featured - 3 cards com imagem */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-12 -mt-4">
          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            {featured.map((section) => {
              const Icon = section.icon
              return (
                <a
                  key={section.title}
                  href={section.href}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  <img
                    src={section.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${section.gradient}`} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                  <div className="relative p-6 md:p-8 text-white min-h-[260px] flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-3xl">{section.emoji}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{section.title}</h2>
                    <p className="text-white/80 text-sm leading-relaxed">{section.description}</p>
                    <div className="flex items-center justify-between mt-5">
                      {section.count && (
                        <span className="text-xs font-medium text-white/70 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
                          {section.count}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                        Explorar
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* Explore grid - com mini banner */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-12">
          <h2 className="text-2xl font-bold mb-6">Mais para explorar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {explore.map((section) => {
              const Icon = section.icon
              return (
                <a
                  key={section.title}
                  href={section.href}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                >
                  {/* Mini banner image */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={section.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${section.gradient} opacity-60`}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-2 left-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-white shadow">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 text-xl">{section.emoji}</span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-base">{section.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-1">
                      Explorar
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* CTA banner */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-12 pb-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1),transparent)]" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative text-center text-white space-y-6 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold">Não sabes por onde começar?</h2>
              <p className="text-white/80 text-lg">
                Descobre criadores que produzem conteúdo nos formatos que mais gostas.
              </p>
              <div>
                <a
                  href="/creators"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 text-base font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg"
                >
                  Ver criadores
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomepageLayout>
  )
}

export default { Page }
