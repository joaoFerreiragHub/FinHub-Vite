import { useMemo, useState, type ComponentType } from 'react'
import {
  Activity,
  AlertTriangle,
  Bot,
  Gauge,
  Loader2,
  Pencil,
  RefreshCcw,
  Settings2,
  ShieldAlert,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { User } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import {
  useAdminFinancialTools,
  useAdminFinancialToolsUsage,
  useUpdateAdminFinancialTool,
} from '../hooks/useAdminFinancialTools'
import { hasAdminScope } from '../lib/access'
import type {
  AdminFinancialToolConfigOverride,
  AdminFinancialToolControlItem,
  AdminFinancialToolEnvironment,
  AdminFinancialToolExperienceMode,
  AdminFinancialToolKey,
} from '../types/adminFinancialTools'

const TOOL_LABEL: Record<AdminFinancialToolKey, string> = {
  stocks: 'Stocks',
  etf: 'ETF',
  reit: 'REIT',
  crypto: 'Crypto',
}

const VERTICAL_LABEL = {
  equities: 'Equities',
  funds: 'Funds',
  real_estate: 'Real estate',
  digital_assets: 'Digital assets',
} as const

type ToolFilter = AdminFinancialToolKey | 'all'

interface FilterState {
  environment: AdminFinancialToolEnvironment
  tool: ToolFilter
  days: string
}

interface EditFormState {
  label: string
  notes: string
  baseEnabled: boolean
  baseMaxSymbolsPerRequest: string
  baseCacheTtlSeconds: string
  baseRequestsPerMinute: string
  baseExperienceMode: AdminFinancialToolExperienceMode
  devOverride: string
  stagingOverride: string
  prodOverride: string
  reason: string
  note: string
}

const INITIAL_FILTERS: FilterState = {
  environment: 'development',
  tool: 'all',
  days: '7',
}

const toPositiveInteger = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

const toNonNegativeInteger = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) return fallback
  return parsed
}

const formatNumber = (value: number, maxFractionDigits = 0): string =>
  new Intl.NumberFormat('pt-PT', { maximumFractionDigits: maxFractionDigits }).format(value)

const formatPercent = (value: number): string => `${formatNumber(value, 2)}%`

const formatDateTime = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' }).format(parsed)
}

const serializeOverride = (value: AdminFinancialToolConfigOverride): string =>
  Object.keys(value).length === 0 ? '' : JSON.stringify(value, null, 2)

const parseOverrideJson = (value: string): AdminFinancialToolConfigOverride | null | undefined => {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (trimmed.toLowerCase() === 'null') return null
  const parsed = JSON.parse(trimmed) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Override deve ser objeto JSON ou null.')
  }
  return parsed as AdminFinancialToolConfigOverride
}

const buildInitialEditForm = (item: AdminFinancialToolControlItem): EditFormState => ({
  label: item.label,
  notes: item.notes ?? '',
  baseEnabled: item.baseConfig.enabled,
  baseMaxSymbolsPerRequest: String(item.baseConfig.maxSymbolsPerRequest),
  baseCacheTtlSeconds: String(item.baseConfig.cacheTtlSeconds),
  baseRequestsPerMinute: String(item.baseConfig.requestsPerMinute),
  baseExperienceMode: item.baseConfig.experienceMode,
  devOverride: serializeOverride(item.envOverrides.development),
  stagingOverride: serializeOverride(item.envOverrides.staging),
  prodOverride: serializeOverride(item.envOverrides.production),
  reason: '',
  note: '',
})

interface KpiCardProps {
  title: string
  value: string
  description: string
  tone?: 'default' | 'warn' | 'danger' | 'success'
  icon?: ComponentType<{ className?: string }>
}

function KpiCard({ title, value, description, tone = 'default', icon: Icon }: KpiCardProps) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-500/30'
      : tone === 'danger'
        ? 'border-red-500/30'
        : tone === 'success'
          ? 'border-emerald-500/30'
          : ''

  return (
    <Card className={toneClass}>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between">
          <span>{title}</span>
          {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
        </CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function AdminFinancialToolsPage() {
  const rawUser = useAuthStore((state) => state.user)
  const user = (rawUser as User | null) ?? null
  const canRead = hasAdminScope(user, 'admin.metrics.read')
  const canWrite = hasAdminScope(user, 'admin.content.moderate') && !user?.adminReadOnly

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [queryFilters, setQueryFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [selectedTool, setSelectedTool] = useState<AdminFinancialToolControlItem | null>(null)
  const [editForm, setEditForm] = useState<EditFormState | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const toolQuery = useMemo(
    () => ({
      environment: queryFilters.environment,
      tool: queryFilters.tool === 'all' ? undefined : queryFilters.tool,
    }),
    [queryFilters.environment, queryFilters.tool],
  )
  const usageQueryParams = useMemo(
    () => ({
      environment: queryFilters.environment,
      tool: queryFilters.tool === 'all' ? undefined : queryFilters.tool,
      days: toPositiveInteger(queryFilters.days, 7),
    }),
    [queryFilters.days, queryFilters.environment, queryFilters.tool],
  )

  const controlsQuery = useAdminFinancialTools(toolQuery, { enabled: canRead })
  const usageQuery = useAdminFinancialToolsUsage(usageQueryParams, { enabled: canRead })
  const updateMutation = useUpdateAdminFinancialTool()
  const controls = controlsQuery.data?.items ?? []
  const usage = usageQuery.data

  const openEditDialog = (item: AdminFinancialToolControlItem) => {
    setSelectedTool(item)
    setEditForm(buildInitialEditForm(item))
    setDialogOpen(true)
  }

  const closeEditDialog = () => {
    if (updateMutation.isPending) return
    setDialogOpen(false)
    setSelectedTool(null)
    setEditForm(null)
  }

  const handleSubmitUpdate = async () => {
    if (!selectedTool || !editForm) return
    const reason = editForm.reason.trim()
    if (!reason) return toast.error('Motivo obrigatorio para atualizar financial tool.')

    let devOverride: AdminFinancialToolConfigOverride | null | undefined
    let stagingOverride: AdminFinancialToolConfigOverride | null | undefined
    let prodOverride: AdminFinancialToolConfigOverride | null | undefined
    try {
      devOverride = parseOverrideJson(editForm.devOverride)
      stagingOverride = parseOverrideJson(editForm.stagingOverride)
      prodOverride = parseOverrideJson(editForm.prodOverride)
    } catch (error) {
      return toast.error(getErrorMessage(error))
    }

    const envOverrides: Partial<Record<AdminFinancialToolEnvironment, AdminFinancialToolConfigOverride | null>> = {}
    if (devOverride !== undefined) envOverrides.development = devOverride
    if (stagingOverride !== undefined) envOverrides.staging = stagingOverride
    if (prodOverride !== undefined) envOverrides.production = prodOverride

    try {
      const result = await updateMutation.mutateAsync({
        tool: selectedTool.tool,
        payload: {
          reason,
          note: editForm.note.trim() || undefined,
          label: editForm.label.trim(),
          notes: editForm.notes.trim() || null,
          baseConfig: {
            enabled: editForm.baseEnabled,
            maxSymbolsPerRequest: toPositiveInteger(editForm.baseMaxSymbolsPerRequest, 25),
            cacheTtlSeconds: toNonNegativeInteger(editForm.baseCacheTtlSeconds, 300),
            requestsPerMinute: toPositiveInteger(editForm.baseRequestsPerMinute, 120),
            experienceMode: editForm.baseExperienceMode,
          },
          envOverrides: Object.keys(envOverrides).length > 0 ? envOverrides : undefined,
        },
      })
      toast.success(result.message)
      closeEditDialog()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (!canRead) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="flex items-start gap-3 py-6 text-sm text-destructive">
          <ShieldAlert className="mt-0.5 h-4 w-4" />
          <p>Perfil atual sem escopo `admin.metrics.read`.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Financial tools control plane</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Feature flags, limites por ambiente e metricas de uso por ferramenta/vertical.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link to="/admin/stats">Estatisticas</Link>
          </Button>
          <Button type="button" size="sm" asChild>
            <Link to="/admin/stats/ferramentas-financeiras">Financial tools</Link>
          </Button>
        </div>
      </div>

      {!canWrite ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="py-3 text-xs text-muted-foreground">
            Sem permissao de escrita (`admin.content.moderate`) ou perfil em modo read-only.
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros operacionais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Select
            value={filters.environment}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, environment: value as AdminFinancialToolEnvironment }))
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.tool}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, tool: value as AdminFinancialToolKey | 'all' }))
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="stocks">Stocks</SelectItem>
              <SelectItem value="etf">ETF</SelectItem>
              <SelectItem value="reit">REIT</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" min={1} max={90} value={filters.days} onChange={(e) => setFilters((p) => ({ ...p, days: e.target.value }))} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setQueryFilters(filters)}>Aplicar</Button>
            <Button type="button" variant="outline" onClick={() => { void controlsQuery.refetch(); void usageQuery.refetch() }} disabled={controlsQuery.isFetching || usageQuery.isFetching}>
              {controlsQuery.isFetching || usageQuery.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Requests" value={formatNumber(usage?.totals.requests ?? 0)} description={`Desde ${usage?.sinceDay ?? '-'}`} icon={Activity} />
        <KpiCard title="Success rate" value={formatPercent(usage?.totals.successRatePercent ?? 0)} description="Taxa de sucesso global." tone={(usage?.totals.successRatePercent ?? 0) >= 98 ? 'success' : 'warn'} icon={Gauge} />
        <KpiCard title="Error rate" value={formatPercent(usage?.totals.errorRatePercent ?? 0)} description="4xx + 5xx." tone={(usage?.totals.errorRatePercent ?? 0) >= 5 ? 'danger' : 'warn'} icon={AlertTriangle} />
        <KpiCard title="Tools" value={formatNumber(controls.length)} description={`Ambiente ${queryFilters.environment}`} icon={Bot} />
      </section>

      <Card>
        <CardHeader><CardTitle className="text-base">Control plane por ferramenta</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead><TableHead>Efetiva</TableHead><TableHead>Base</TableHead><TableHead>Version</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Acao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.length === 0 ? <TableRow><TableCell colSpan={6} className="text-muted-foreground">Sem controlos para filtros atuais.</TableCell></TableRow> : controls.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><p className="font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{TOOL_LABEL[item.tool]} | {VERTICAL_LABEL[item.vertical]}</p></TableCell>
                  <TableCell><div className="flex flex-wrap gap-1 text-xs"><Badge variant={item.effectiveConfig.enabled ? 'secondary' : 'destructive'}>{item.effectiveConfig.enabled ? 'on' : 'off'}</Badge><Badge variant="outline">max {item.effectiveConfig.maxSymbolsPerRequest}</Badge><Badge variant="outline">ttl {item.effectiveConfig.cacheTtlSeconds}s</Badge><Badge variant="outline">rpm {item.effectiveConfig.requestsPerMinute}</Badge></div></TableCell>
                  <TableCell><div className="flex flex-wrap gap-1 text-xs"><Badge variant={item.baseConfig.enabled ? 'secondary' : 'destructive'}>{item.baseConfig.enabled ? 'on' : 'off'}</Badge><Badge variant="outline">max {item.baseConfig.maxSymbolsPerRequest}</Badge><Badge variant="outline">ttl {item.baseConfig.cacheTtlSeconds}s</Badge><Badge variant="outline">rpm {item.baseConfig.requestsPerMinute}</Badge></div></TableCell>
                  <TableCell>v{item.version}</TableCell>
                  <TableCell>{formatDateTime(item.updatedAt)}</TableCell>
                  <TableCell className="text-right"><Button type="button" size="sm" variant="outline" disabled={!canWrite} onClick={() => openEditDialog(item)}><Pencil className="mr-1 h-4 w-4" />Editar</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => (!open ? closeEditDialog() : undefined)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle>Editar financial tool</DialogTitle><DialogDescription>Overrides aceitam JSON ({'{}'}) ou `null` para limpar ambiente.</DialogDescription></DialogHeader>
          {selectedTool && editForm ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Label</Label><Input value={editForm.label} onChange={(e) => setEditForm((p) => p ? { ...p, label: e.target.value } : p)} /></div>
                <div><Label>Notas</Label><Input value={editForm.notes} onChange={(e) => setEditForm((p) => p ? { ...p, notes: e.target.value } : p)} /></div>
                <div><Label>Base enabled</Label><Select value={editForm.baseEnabled ? 'true' : 'false'} onValueChange={(v) => setEditForm((p) => p ? { ...p, baseEnabled: v === 'true' } : p)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="true">On</SelectItem><SelectItem value="false">Off</SelectItem></SelectContent></Select></div>
                <div><Label>Base max symbols</Label><Input type="number" min={1} value={editForm.baseMaxSymbolsPerRequest} onChange={(e) => setEditForm((p) => p ? { ...p, baseMaxSymbolsPerRequest: e.target.value } : p)} /></div>
                <div><Label>Base cache ttl (s)</Label><Input type="number" min={0} value={editForm.baseCacheTtlSeconds} onChange={(e) => setEditForm((p) => p ? { ...p, baseCacheTtlSeconds: e.target.value } : p)} /></div>
                <div><Label>Base requests/min</Label><Input type="number" min={1} value={editForm.baseRequestsPerMinute} onChange={(e) => setEditForm((p) => p ? { ...p, baseRequestsPerMinute: e.target.value } : p)} /></div>
                <div><Label>Base experience</Label><Select value={editForm.baseExperienceMode} onValueChange={(v) => setEditForm((p) => p ? { ...p, baseExperienceMode: v as AdminFinancialToolExperienceMode } : p)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="legacy">Legacy</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="enhanced">Enhanced</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div><Label>Override development (JSON/null)</Label><Textarea rows={6} value={editForm.devOverride} onChange={(e) => setEditForm((p) => p ? { ...p, devOverride: e.target.value } : p)} /></div>
                <div><Label>Override staging (JSON/null)</Label><Textarea rows={6} value={editForm.stagingOverride} onChange={(e) => setEditForm((p) => p ? { ...p, stagingOverride: e.target.value } : p)} /></div>
                <div><Label>Override production (JSON/null)</Label><Textarea rows={6} value={editForm.prodOverride} onChange={(e) => setEditForm((p) => p ? { ...p, prodOverride: e.target.value } : p)} /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Motivo (obrigatorio)</Label><Input value={editForm.reason} onChange={(e) => setEditForm((p) => p ? { ...p, reason: e.target.value } : p)} /></div>
                <div><Label>Nota (opcional)</Label><Input value={editForm.note} onChange={(e) => setEditForm((p) => p ? { ...p, note: e.target.value } : p)} /></div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEditDialog}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmitUpdate()}
              disabled={!canWrite || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Settings2 className="mr-2 h-4 w-4" />
              )}
              Guardar alteracoes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
