import { useMemo, useState } from 'react'
import { Download, Loader2, RefreshCcw, Search, ShieldAlert } from 'lucide-react'
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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { User } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import { useAdminAuditLogs, useExportAdminAuditLogsCsv } from '../hooks/useAdminAuditLogs'
import { hasAdminScope } from '../lib/access'
import type { AdminAuditLogsQuery, AdminAuditOutcome } from '../types/adminAuditLogs'

type OutcomeFilter = AdminAuditOutcome | 'all'

interface FilterState {
  actorId: string
  action: string
  resourceType: string
  outcome: OutcomeFilter
  requestId: string
  from: string
  to: string
}

const PAGE_SIZE = 50

const INITIAL_FILTERS: FilterState = {
  actorId: '',
  action: '',
  resourceType: '',
  outcome: 'all',
  requestId: '',
  from: '',
  to: '',
}

const toIsoDate = (value: string): string | undefined => {
  if (!value.trim()) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString()
}

const formatDateTime = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const outcomeVariant = (outcome: AdminAuditOutcome): 'secondary' | 'outline' | 'destructive' => {
  if (outcome === 'error') return 'destructive'
  if (outcome === 'forbidden') return 'outline'
  return 'secondary'
}

const outcomeLabel: Record<AdminAuditOutcome, string> = {
  success: 'Success',
  forbidden: 'Forbidden',
  error: 'Error',
}

export default function AdminAuditLogsPage() {
  const rawUser = useAuthStore((state) => state.user)
  const user = (rawUser as User | null) ?? null
  const canReadAudit = hasAdminScope(user, 'admin.audit.read')

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [queryFilters, setQueryFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const query = useMemo<AdminAuditLogsQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      actorId: queryFilters.actorId.trim() || undefined,
      action: queryFilters.action.trim() || undefined,
      resourceType: queryFilters.resourceType.trim() || undefined,
      outcome: queryFilters.outcome === 'all' ? undefined : queryFilters.outcome,
      requestId: queryFilters.requestId.trim() || undefined,
      from: toIsoDate(queryFilters.from),
      to: toIsoDate(queryFilters.to),
    }),
    [page, queryFilters],
  )

  const auditLogsQuery = useAdminAuditLogs(query, { enabled: canReadAudit })
  const exportCsvMutation = useExportAdminAuditLogsCsv()

  const items = auditLogsQuery.data?.items ?? []
  const pagination = auditLogsQuery.data?.pagination

  const applyFilters = () => {
    setQueryFilters(filters)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setQueryFilters(INITIAL_FILTERS)
    setPage(1)
  }

  const handleExportCsv = async () => {
    try {
      await exportCsvMutation.mutateAsync({ ...query, maxRows: 5000 })
      toast.success('Export CSV iniciado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (!canReadAudit) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <ShieldAlert className="mt-0.5 h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">Perfil atual sem escopo `admin.audit.read`.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Auditoria administrativa</h1>
        <p className="text-sm text-muted-foreground">
          Consulta operacional de logs admin com filtros e export CSV.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Refina por actor, acao, recurso, outcome e intervalo temporal.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Label htmlFor="audit-actor">Actor ID</Label>
            <Input
              id="audit-actor"
              value={filters.actorId}
              onChange={(event) => setFilters((prev) => ({ ...prev, actorId: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="audit-action">Acao</Label>
            <Input
              id="audit-action"
              value={filters.action}
              onChange={(event) => setFilters((prev) => ({ ...prev, action: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="audit-resource-type">Resource type</Label>
            <Input
              id="audit-resource-type"
              value={filters.resourceType}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, resourceType: event.target.value }))
              }
            />
          </div>
          <div>
            <Label>Outcome</Label>
            <Select
              value={filters.outcome}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, outcome: value as OutcomeFilter }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="forbidden">Forbidden</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="audit-request-id">Request ID</Label>
            <Input
              id="audit-request-id"
              value={filters.requestId}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, requestId: event.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="audit-from">From</Label>
            <Input
              id="audit-from"
              type="datetime-local"
              value={filters.from}
              onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="audit-to">To</Label>
            <Input
              id="audit-to"
              type="datetime-local"
              value={filters.to}
              onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
            />
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <Button type="button" onClick={applyFilters}>
              <Search className="mr-2 h-4 w-4" />
              Aplicar
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => auditLogsQuery.refetch()}
              disabled={auditLogsQuery.isFetching}
            >
              {auditLogsQuery.isFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleExportCsv}
              disabled={exportCsvMutation.isPending}
            >
              {exportCsvMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>
            {pagination
              ? `Pagina ${pagination.page} de ${pagination.pages} - total ${pagination.total} eventos`
              : 'Sem dados'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {auditLogsQuery.isLoading ? (
            <div className="h-20 animate-pulse rounded-md bg-muted" />
          ) : items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem logs para os filtros atuais.
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quando</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Acao</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {formatDateTime(item.createdAt)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.actor?.username ||
                          item.actor?.name ||
                          item.actor?.email ||
                          item.actor?.id ||
                          'N/A'}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{item.action}</TableCell>
                      <TableCell className="text-xs">
                        {item.resourceType}
                        {item.resourceId ? `:${item.resourceId}` : ''}
                      </TableCell>
                      <TableCell>
                        <Badge variant={outcomeVariant(item.outcome)}>
                          {outcomeLabel[item.outcome]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{item.statusCode}</TableCell>
                      <TableCell className="max-w-[320px] truncate text-xs">
                        {item.method} {item.path}
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate text-xs">
                        {item.reason || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={!pagination || pagination.page <= 1 || auditLogsQuery.isFetching}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Anterior
            </Button>
            <p className="text-xs text-muted-foreground">
              {pagination ? `Pagina ${pagination.page} / ${pagination.pages}` : '-'}
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={
                !pagination || pagination.page >= pagination.pages || auditLogsQuery.isFetching
              }
              onClick={() => setPage((prev) => prev + 1)}
            >
              Seguinte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
