import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarClock, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import {
  legalDocumentsService,
  type LegalDocument,
  type LegalDocumentKey,
} from '@/features/platform/services/legalDocumentsService'

const FALLBACK_ROUTES: Record<LegalDocumentKey, string> = {
  terms: '/termos',
  privacy: '/privacidade',
  cookies: '/cookies',
  'financial-disclaimer': '/aviso-legal',
}

const FALLBACK_TITLES: Record<LegalDocumentKey, string> = {
  terms: 'Termos de Servico',
  privacy: 'Politica de Privacidade',
  cookies: 'Politica de Cookies',
  'financial-disclaimer': 'Aviso Legal Financeiro',
}

const formatDateTime = (value?: string): string => {
  if (!value) return 'n/d'

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return 'n/d'

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate)
}

const buildFallbackDocument = (documentKey: LegalDocumentKey): LegalDocument => ({
  key: documentKey,
  title: FALLBACK_TITLES[documentKey],
  version: 'v1',
  lastUpdatedAt: '',
  requiredAtSignup: documentKey !== 'cookies',
  routePath: FALLBACK_ROUTES[documentKey],
  summary: 'Documento legal da plataforma FinHub.',
  content:
    'Nao foi possivel carregar o conteudo atualizado neste momento. Tenta novamente em instantes.',
})

interface LegalDocumentPageProps {
  documentKey: LegalDocumentKey
}

export function LegalDocumentPage({ documentKey }: LegalDocumentPageProps) {
  const documentQuery = useQuery({
    queryKey: ['platform', 'legal-document', documentKey],
    queryFn: () => legalDocumentsService.getByKey(documentKey),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const listQuery = useQuery({
    queryKey: ['platform', 'legal-documents'],
    queryFn: legalDocumentsService.list,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })

  const document = documentQuery.data ?? buildFallbackDocument(documentKey)

  const relatedDocuments = useMemo(() => {
    const documents = Array.isArray(listQuery.data) ? listQuery.data : []
    return documents.filter((item) => item.key !== document.key)
  }, [listQuery.data, document.key])

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Documento legal
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {document.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {document.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
              Versao: {document.version || 'v1'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
              <CalendarClock className="h-3.5 w-3.5" />
              Atualizado: {formatDateTime(document.lastUpdatedAt)}
            </span>
            {document.requiredAtSignup ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                Obrigatorio no registo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
                Opcional no registo
              </span>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {documentQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">A carregar documento...</p>
          ) : null}
          {documentQuery.isError ? (
            <p className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
              Conteudo indisponivel temporariamente. Mostramos uma versao de fallback.
            </p>
          ) : null}
          <p className="whitespace-pre-line text-sm leading-7 text-foreground sm:text-base">
            {document.content}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Outros documentos
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedDocuments.length > 0 ? (
              relatedDocuments.map((item) => (
                <Button key={item.key} asChild variant="outline" size="sm">
                  <Link to={item.routePath}>{item.title}</Link>
                </Button>
              ))
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/termos">Termos</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/privacidade">Privacidade</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/cookies">Cookies</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/aviso-legal">Aviso legal</Link>
                </Button>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
