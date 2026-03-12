import { useMemo, useState } from 'react'
import { Activity, Eye, FileSpreadsheet, History, Play, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { hasAdminScope } from '../lib/access'
import {
  useAdminBulkImportJob,
  useAdminBulkImportJobs,
  useCreateAdminBulkImportJob,
  usePreviewAdminBulkImport,
} from '../hooks/useAdminBulkImport'
import type {
  AdminBulkImportStatus,
  AdminBulkImportType,
  AdminBulkImportJobItem,
} from '../types/adminBulkImport'

const IMPORT_TYPE_LABEL: Record<AdminBulkImportType, string> = {
  subscription_entitlements: 'Subscricoes e entitlements',
  ad_campaign_status: 'Campanhas de ads',
}

const STATUS_LABEL: Record<AdminBulkImportStatus, string> = {
  running: 'Running',
  completed: 'Completed',
  completed_with_errors: 'Com erros',
  failed: 'Failed',
}

const STATUS_BADGE_VARIANT: Record<AdminBulkImportStatus, 'secondary' | 'outline' | 'destructive'> =
  {
    running: 'secondary',
    completed: 'outline',
    completed_with_errors: 'destructive',
    failed: 'destructive',
  }

const SUBSCRIPTION_TEMPLATE = [
  'email,planCode,planLabel,status,billingCycle,entitlementActive,cancelAtPeriodEnd,currentPeriodEnd,trialEndsAt',
  'user1@exemplo.com,premium_monthly,Premium Monthly,active,monthly,true,false,2026-06-01T00:00:00.000Z,',
  'user2@exemplo.com,premium_yearly,Premium Annual,trialing,yearly,true,false,,2026-04-01T00:00:00.000Z',
].join('\n')

const ADS_TEMPLATE = [
  'code,status,priority,startAt,endAt',
  'CAMP-ALPHA,active,100,2026-03-01T00:00:00.000Z,2026-06-01T00:00:00.000Z',
  'CAMP-BETA,paused,20,,',
].join('\n')

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const toFilterParam = <T extends string>(value: string): T | undefined =>
  value === 'all' ? undefined : (value as T)

const mapDelimiterValue = (value: string): string => (value === 'tab' ? '\t' : value)
const displayDelimiter = (value: string): string =>
  value === '\t' ? 'TAB' : value === ';' ? ';' : ','

interface AdminBulkImportPageProps {
  embedded?: boolean
}

const renderJobSummary = (job: AdminBulkImportJobItem) => (
  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
    <span>Total: {job.summary.totalRows}</span>
    <span>Validas: {job.summary.validRows}</span>
    <span>Sucesso: {job.summary.succeededRows}</span>
    <span>Falhas: {job.summary.failedRows}</span>
  </div>
)

export default function AdminBulkImportPage({ embedded = false }: AdminBulkImportPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.users.read')
  const canWrite = hasAdminScope(user, 'admin.users.write') && !user?.adminReadOnly

  const [importType, setImportType] = useState<AdminBulkImportType>('subscription_entitlements')
  const [delimiter, setDelimiter] = useState(',')
  const [csvInput, setCsvInput] = useState('')
  const [dryRun, setDryRun] = useState(false)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<'all' | AdminBulkImportStatus>('all')
  const [importTypeFilter, setImportTypeFilter] = useState<'all' | AdminBulkImportType>('all')
  const [dryRunFilter, setDryRunFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [page, setPage] = useState(1)

  const jobsQuery = useMemo(
    () => ({
      page,
      limit: 10,
      importType: toFilterParam<AdminBulkImportType>(importTypeFilter),
      status: toFilterParam<AdminBulkImportStatus>(statusFilter),
      dryRun: dryRunFilter === 'all' ? undefined : dryRunFilter === 'yes',
    }),
    [dryRunFilter, importTypeFilter, page, statusFilter],
  )

  const jobsQueryState = useAdminBulkImportJobs(jobsQuery, { enabled: canRead })
  const jobDetailQuery = useAdminBulkImportJob(selectedJobId, { enabled: canRead })
  const previewMutation = usePreviewAdminBulkImport()
  const createJobMutation = useCreateAdminBulkImportJob()

  const previewData = previewMutation.data

  const activeTemplate =
    importType === 'subscription_entitlements' ? SUBSCRIPTION_TEMPLATE : ADS_TEMPLATE
  const isActionPending = previewMutation.isPending || createJobMutation.isPending

  const handleInsertTemplate = () => {
    setCsvInput(activeTemplate)
  }

  const handlePreview = async () => {
    const csv = csvInput.trim()
    if (!csv) {
      toast.error('CSV obrigatorio para preview.')
      return
    }

    try {
      const result = await previewMutation.mutateAsync({
        importType,
        csv,
        delimiter: mapDelimiterValue(delimiter),
      })
      toast.success(`Preview gerado: ${result.summary.validRows} linhas validas.`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleRunImport = async () => {
    if (!canWrite) return

    const csv = csvInput.trim()
    if (!csv) {
      toast.error('CSV obrigatorio para executar import.')
      return
    }
    if (!reason.trim()) {
      toast.error('Motivo obrigatorio para executar import.')
      return
    }

    try {
      const result = await createJobMutation.mutateAsync({
        importType,
        csv,
        delimiter: mapDelimiterValue(delimiter),
        dryRun,
        reason: reason.trim(),
        note: note.trim() || undefined,
      })
      setSelectedJobId(result.item.id)
      toast.success(result.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const refreshJobs = () => {
    jobsQueryState.refetch().catch(() => undefined)
    if (selectedJobId) {
      jobDetailQuery.refetch().catch(() => undefined)
    }
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bulk import operacional</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preview e execucao controlada de CSV para subscricoes e campanhas.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" asChild>
          <a href="/admin/operacoes">Bulk import</a>
        </Button>
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/admin/operacoes/comunicacoes">Comunicacoes</a>
        </Button>
      </div>

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de jobs de bulk import (`admin.users.read`).
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            Preview e execucao CSV
          </CardTitle>
          <CardDescription>
            Usa preview antes de executar. Dry-run valida linhas sem persistir alteracoes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bulk-import-type">
                Tipo de importacao
              </label>
              <Select
                value={importType}
                onValueChange={(value) => setImportType(value as AdminBulkImportType)}
                disabled={isActionPending || !canRead}
              >
                <SelectTrigger id="bulk-import-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription_entitlements">
                    {IMPORT_TYPE_LABEL.subscription_entitlements}
                  </SelectItem>
                  <SelectItem value="ad_campaign_status">
                    {IMPORT_TYPE_LABEL.ad_campaign_status}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bulk-import-delimiter">
                Delimitador
              </label>
              <Select
                value={delimiter}
                onValueChange={setDelimiter}
                disabled={isActionPending || !canRead}
              >
                <SelectTrigger id="bulk-import-delimiter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Virgula (,)</SelectItem>
                  <SelectItem value=";">Ponto e virgula (;)</SelectItem>
                  <SelectItem value="tab">TAB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bulk-import-dryrun">
                Modo de execucao
              </label>
              <Select
                value={dryRun ? 'yes' : 'no'}
                onValueChange={(value) => setDryRun(value === 'yes')}
                disabled={isActionPending || !canWrite}
              >
                <SelectTrigger id="bulk-import-dryrun">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Dry-run</SelectItem>
                  <SelectItem value="no">Efetivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleInsertTemplate}
                disabled={isActionPending || !canRead}
              >
                Inserir template
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="bulk-import-csv">
              CSV
            </label>
            <Textarea
              id="bulk-import-csv"
              value={csvInput}
              onChange={(event) => setCsvInput(event.target.value)}
              rows={10}
              placeholder="Cole o conteudo CSV aqui."
              disabled={isActionPending || !canRead}
            />
            <p className="text-xs text-muted-foreground">
              Template ativo: {IMPORT_TYPE_LABEL[importType]} | delimiter:{' '}
              {displayDelimiter(mapDelimiterValue(delimiter))}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bulk-import-reason">
                Motivo (obrigatorio na execucao)
              </label>
              <Input
                id="bulk-import-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Ex.: campanha de correcao de subscricoes."
                disabled={isActionPending || !canWrite}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bulk-import-note">
                Nota interna (opcional)
              </label>
              <Input
                id="bulk-import-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Contexto para auditoria interna."
                disabled={isActionPending || !canWrite}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={isActionPending || !canRead}
            >
              {previewMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              Preview
            </Button>
            <Button type="button" onClick={handleRunImport} disabled={isActionPending || !canWrite}>
              {createJobMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Executar
            </Button>
            {!canWrite ? (
              <Badge variant="outline" className="text-muted-foreground">
                Escrita bloqueada (read-only ou sem `admin.users.write`)
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {previewData ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultado do preview</CardTitle>
            <CardDescription>
              {IMPORT_TYPE_LABEL[previewData.importType]} | rows: {previewData.summary.totalRows}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Validas: {previewData.summary.validRows}</Badge>
              <Badge variant="outline">Falhadas: {previewData.summary.failedRows}</Badge>
              <Badge variant="outline">Ignoradas: {previewData.summary.skippedRows}</Badge>
              <Badge variant="outline">Warnings: {previewData.summary.warningsCount}</Badge>
            </div>

            {previewData.warnings.length > 0 ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                <p className="text-sm font-medium text-amber-700">Warnings</p>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {previewData.warnings.slice(0, 6).map((warning, index) => (
                    <li key={`${warning}-${index}`}>- {warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-medium">Amostra de linhas</p>
              {(previewData.rowsSample ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem linhas de amostra.</p>
              ) : (
                <div className="space-y-2">
                  {previewData.rowsSample.slice(0, 10).map((row) => (
                    <div
                      key={`${row.rowNumber}-${row.code}-${row.message}`}
                      className="rounded-md border p-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Linha {row.rowNumber}</Badge>
                        <Badge variant={row.status === 'valid' ? 'secondary' : 'destructive'}>
                          {row.status}
                        </Badge>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {row.code}
                        </span>
                      </div>
                      <p className="mt-1 text-muted-foreground">{row.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4 text-muted-foreground" />
                Jobs recentes
              </CardTitle>
              <CardDescription>
                Consulta de execucoes com filtros por tipo, estado e dry-run.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={refreshJobs}
              disabled={jobsQueryState.isFetching}
            >
              <RefreshCw
                className={cn('h-4 w-4', jobsQueryState.isFetching ? 'animate-spin' : '')}
              />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Select
              value={importTypeFilter}
              onValueChange={(value) => {
                setImportTypeFilter(value as 'all' | AdminBulkImportType)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="subscription_entitlements">
                  {IMPORT_TYPE_LABEL.subscription_entitlements}
                </SelectItem>
                <SelectItem value="ad_campaign_status">
                  {IMPORT_TYPE_LABEL.ad_campaign_status}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as 'all' | AdminBulkImportStatus)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="completed_with_errors">Com erros</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dryRunFilter}
              onValueChange={(value) => {
                setDryRunFilter(value as 'all' | 'yes' | 'no')
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="yes">Dry-run</SelectItem>
                <SelectItem value="no">Efetivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {jobsQueryState.isLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-md bg-muted" />
              <div className="h-16 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (jobsQueryState.data?.items.length ?? 0) === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem jobs para os filtros selecionados.
            </p>
          ) : (
            <div className="space-y-3">
              {jobsQueryState.data?.items.map((job) => (
                <div key={job.id} className="rounded-md border border-border/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={STATUS_BADGE_VARIANT[job.status]}>
                        {STATUS_LABEL[job.status]}
                      </Badge>
                      <Badge variant="outline">{IMPORT_TYPE_LABEL[job.importType]}</Badge>
                      <Badge variant="outline">{job.dryRun ? 'Dry-run' : 'Efetivo'}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(job.createdAt)} |{' '}
                      {job.actor?.email ?? job.actor?.username ?? 's/ator'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{job.reason || 'Sem motivo'}</p>
                  <div className="mt-2">{renderJobSummary(job)}</div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedJobId(job.id)}
                    >
                      <Activity className="h-4 w-4" />
                      Ver detalhe
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Pagina {jobsQueryState.data?.pagination.page ?? 1} de{' '}
              {jobsQueryState.data?.pagination.pages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= (jobsQueryState.data?.pagination.pages ?? 1)}
              >
                Seguinte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedJobId ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalhe do job selecionado</CardTitle>
            <CardDescription>Job ID: {selectedJobId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobDetailQuery.isLoading ? (
              <div className="h-16 animate-pulse rounded-md bg-muted" />
            ) : !jobDetailQuery.data ? (
              <p className="text-sm text-muted-foreground">Sem detalhe para o job selecionado.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={STATUS_BADGE_VARIANT[jobDetailQuery.data.status]}>
                    {STATUS_LABEL[jobDetailQuery.data.status]}
                  </Badge>
                  <Badge variant="outline">
                    {IMPORT_TYPE_LABEL[jobDetailQuery.data.importType]}
                  </Badge>
                  <Badge variant="outline">
                    {jobDetailQuery.data.dryRun ? 'Dry-run' : 'Efetivo'}
                  </Badge>
                  <Badge variant="outline">
                    Inicio: {formatDateTime(jobDetailQuery.data.startedAt)}
                  </Badge>
                  <Badge variant="outline">
                    Fim: {formatDateTime(jobDetailQuery.data.finishedAt)}
                  </Badge>
                </div>

                <div>{renderJobSummary(jobDetailQuery.data)}</div>

                {(jobDetailQuery.data.errors?.length ?? 0) > 0 ? (
                  <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
                    <p className="text-sm font-medium text-red-700">Erros por linha</p>
                    <div className="mt-2 space-y-2">
                      {jobDetailQuery.data.errors?.slice(0, 15).map((error) => (
                        <div
                          key={`${error.rowNumber}-${error.code}-${error.message}`}
                          className="rounded-md border border-red-500/20 bg-background p-2 text-xs"
                        >
                          <p className="font-medium">
                            Linha {error.rowNumber} | {error.code}
                          </p>
                          <p className="text-muted-foreground">{error.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {(jobDetailQuery.data.results?.length ?? 0) > 0 ? (
                  <div className="rounded-md border border-border/70 p-3">
                    <p className="text-sm font-medium">Resultados por linha</p>
                    <div className="mt-2 space-y-2">
                      {jobDetailQuery.data.results?.slice(0, 20).map((result) => (
                        <div
                          key={`${result.rowNumber}-${result.status}-${result.message}`}
                          className="rounded-md border border-border/60 p-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Linha {result.rowNumber}</Badge>
                            <Badge
                              variant={result.status === 'failed' ? 'destructive' : 'secondary'}
                            >
                              {result.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-muted-foreground">{result.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
