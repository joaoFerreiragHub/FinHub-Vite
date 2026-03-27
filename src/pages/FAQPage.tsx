import { Link } from '@/lib/reactRouterDomCompat'
import { Button } from '@/components/ui'

const faqs = [
  {
    question: 'O FinHub e aconselhamento financeiro?',
    answer:
      'Nao. O FinHub e uma plataforma de literacia financeira. O conteudo e informativo e nao substitui aconselhamento profissional individual.',
  },
  {
    question: 'Preciso pagar para usar a plataforma?',
    answer:
      'O acesso base e gratuito. Alguns criadores e recursos podem disponibilizar formatos premium, dependendo da estrategia de cada perfil.',
  },
  {
    question: 'Como escolho bons criadores para seguir?',
    answer:
      'Analisa consistencia de publicacao, clareza do conteudo, transparencia sobre riscos e alinhamento com o teu nivel de conhecimento.',
  },
  {
    question: 'Posso reportar conteudo incorreto ou abusivo?',
    answer:
      'Sim. Usa as opcoes de reporte no conteudo e no perfil. A equipa de moderacao analisa os casos com trilha de auditoria.',
  },
  {
    question: 'Como funcionam os dados de mercado e analytics?',
    answer:
      'As ferramentas usam fontes externas e processamento interno. Analytics so e ativado quando existe consentimento de cookies adequado.',
  },
  {
    question: 'Quero apagar a minha conta e exportar os meus dados. E possivel?',
    answer:
      'Sim. Na pagina de conta tens opcoes para exportar dados e eliminar conta, em linha com os requisitos RGPD.',
  },
]

export default function FAQPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            FAQ
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Perguntas frequentes
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Respostas diretas sobre utilizacao, seguranca, conteudo e operacao da plataforma.
          </p>
        </section>

        <section className="space-y-3">
          {faqs.map((item) => (
            <details key={item.question} className="rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                {item.question}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Ainda tens duvidas?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fala connosco e partilha o teu contexto para receberes apoio mais rapido.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/contacto">Ir para contacto</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
