import { useMemo, useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
  Send,
  XCircle,
} from 'lucide-react'
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
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { AdminOperationsNav } from '../components/AdminOperationsNav'
import {
  useActivateAdminAdCampaign,
  useAdminAdCampaignMetrics,
  useAdminAdCampaigns,
  useAdminAdSlots,
  useAdminAdsInventoryOverview,
  useApproveAdminAdCampaign,
  useCreateAdminAdCampaign,
  useCreateAdminAdSlot,
  usePauseAdminAdCampaign,
  useRejectAdminAdCampaign,
  useSubmitAdminAdCampaignForApproval,
  useUpdateAdminAdCampaign,
  useUpdateAdminAdSlot,
} from '../hooks/useAdminAdPartnership'
import { hasAdminScope } from '../lib/access'
import type {
  AdminAdCampaignStatus,
  AdminAdCampaignsListQuery,
  AdminAdDevice,
  AdminAdPosition,
  AdminAdSlotsListQuery,
  AdminAdSponsorType,
  AdminAdSurface,
  AdminAdType,
  AdminAdVisibility,
} from '../types/adminAdPartnership'
import {
  ADMIN_AD_CAMPAIGN_STATUSES,
  ADMIN_AD_DEVICES,
  ADMIN_AD_POSITIONS,
  ADMIN_AD_SPONSOR_TYPES,
  ADMIN_AD_SURFACES,
  ADMIN_AD_TYPES,
  ADMIN_AD_VISIBILITY,
} from '../types/adminAdPartnership'

const AD_TYPE_LABEL: Record<AdminAdType, string> = {
  external_ads: 'External ads',
  sponsored_ads: 'Sponsored ads',
  house_ads: 'House ads',
  value_ads: 'Value ads',
}

const CAMPAIGN_STATUS_LABEL: Record<AdminAdCampaignStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending approval',
  approved: 'Approved',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  rejected: 'Rejected',
  archived: 'Archived',
}

const CAMPAIGN_STATUS_BADGE: Record<
  AdminAdCampaignStatus,
  'secondary' | 'outline' | 'destructive'
> = {
  draft: 'outline',
  pending_approval: 'secondary',
  approved: 'secondary',
  active: 'secondary',
  paused: 'outline',
  completed: 'outline',
  rejected: 'destructive',
  archived: 'outline',
}

const SURFACE_LABEL: Record<AdminAdSurface, string> = {
  home_feed: 'Home feed',
  tools: 'Tools',
  directory: 'Directory',
  content: 'Content',
  learning: 'Learning',
  community: 'Community',
  dashboard: 'Dashboard',
  profile: 'Profile',
}

const DEVICE_LABEL: Record<AdminAdDevice, string> = {
  all: 'All',
  desktop: 'Desktop',
  mobile: 'Mobile',
}

const POSITION_LABEL: Record<AdminAdPosition, string> = {
  sidebar: 'Sidebar',
  inline: 'Inline',
  footer: 'Footer',
  header: 'Header',
  banner: 'Banner',
  card: 'Card',
  comparison_strip: 'Comparison strip',
}

const SPONSOR_LABEL: Record<AdminAdSponsorType, string> = {
  brand: 'Brand',
  creator: 'Creator',
  platform: 'Platform',
}

const AD_TYPE_SET = new Set<AdminAdType>(ADMIN_AD_TYPES)
const AD_VISIBILITY_SET = new Set<AdminAdVisibility>(ADMIN_AD_VISIBILITY)
const AD_SURFACE_SET = new Set<AdminAdSurface>(ADMIN_AD_SURFACES)

const parseCsv = (value: string): string[] => {
  if (!value.trim()) return []
  const unique = new Set(
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  )
  return Array.from(unique)
}

const parseAdTypes = (value: string): AdminAdType[] =>
  parseCsv(value).filter((item): item is AdminAdType => AD_TYPE_SET.has(item as AdminAdType))

const parseVisibility = (value: string): AdminAdVisibility[] =>
  parseCsv(value).filter(
    (item): item is AdminAdVisibility => AD_VISIBILITY_SET.has(item as AdminAdVisibility),
  )

const parseSurfaces = (value: string): AdminAdSurface[] =>
  parseCsv(value).filter((item): item is AdminAdSurface => AD_SURFACE_SET.has(item as AdminAdSurface))

const toFilterParam = <T extends string>(value: string): T | undefined =>
  value === 'all' ? undefined : (value as T)

const toInt = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return fallback
  return parsed
}

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

interface AdminAdPartnershipsPageProps {
  embedded?: boolean
}

export default function AdminAdPartnershipsPage({
  embedded = false,
}: AdminAdPartnershipsPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.content.read')
  const canWrite = hasAdminScope(user, 'admin.content.moderate') && !user?.adminReadOnly

  const [slotSurfaceFilter, setSlotSurfaceFilter] = useState<'all' | AdminAdSurface>('all')
  const [slotDeviceFilter, setSlotDeviceFilter] = useState<'all' | AdminAdDevice>('all')
  const [slotActiveFilter, setSlotActiveFilter] = useState<'all' | 'true' | 'false'>('all')
  const [slotPage, setSlotPage] = useState(1)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)

  const [slotIdInput, setSlotIdInput] = useState('')
  const [slotLabelInput, setSlotLabelInput] = useState('')
  const [slotSurfaceInput, setSlotSurfaceInput] = useState<AdminAdSurface>('content')
  const [slotPositionInput, setSlotPositionInput] = useState<AdminAdPosition>('inline')
  const [slotDeviceInput, setSlotDeviceInput] = useState<AdminAdDevice>('all')
  const [slotAllowedTypesInput, setSlotAllowedTypesInput] = useState('sponsored_ads,house_ads')
  const [slotVisibleToInput, setSlotVisibleToInput] = useState('all')
  const [slotReason, setSlotReason] = useState('')
  const [slotNote, setSlotNote] = useState('')

  const [campaignStatusFilter, setCampaignStatusFilter] = useState<
    'all' | AdminAdCampaignStatus
  >('all')
  const [campaignSearchFilter, setCampaignSearchFilter] = useState('')
  const [campaignPage, setCampaignPage] = useState(1)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

  const [campaignCodeInput, setCampaignCodeInput] = useState('')
  const [campaignTitleInput, setCampaignTitleInput] = useState('')
  const [campaignHeadlineInput, setCampaignHeadlineInput] = useState('')
  const [campaignAdTypeInput, setCampaignAdTypeInput] = useState<AdminAdType>('sponsored_ads')
  const [campaignSponsorInput, setCampaignSponsorInput] = useState<AdminAdSponsorType>('brand')
  const [campaignDirectoryEntryIdInput, setCampaignDirectoryEntryIdInput] = useState('')
  const [campaignSlotIdsInput, setCampaignSlotIdsInput] = useState('')
  const [campaignSurfacesInput, setCampaignSurfacesInput] = useState('content')
  const [campaignVisibleToInput, setCampaignVisibleToInput] = useState('all')
  const [campaignRelevanceTagsInput, setCampaignRelevanceTagsInput] = useState('finance')
  const [campaignPriorityInput, setCampaignPriorityInput] = useState('100')
  const [campaignReason, setCampaignReason] = useState('')
  const [campaignNote, setCampaignNote] = useState('')

  const [metricsDays, setMetricsDays] = useState('30')

  const slotQuery = useMemo<AdminAdSlotsListQuery>(
    () => ({
      page: slotPage,
      limit: 10,
      surface: toFilterParam<AdminAdSurface>(slotSurfaceFilter),
      device: toFilterParam<AdminAdDevice>(slotDeviceFilter),
      isActive:
        slotActiveFilter === 'all' ? undefined : slotActiveFilter === 'true' ? true : false,
    }),
    [slotActiveFilter, slotDeviceFilter, slotPage, slotSurfaceFilter],
  )

  const campaignQuery = useMemo<AdminAdCampaignsListQuery>(
    () => ({
      page: campaignPage,
      limit: 10,
      status: toFilterParam<AdminAdCampaignStatus>(campaignStatusFilter),
      search: campaignSearchFilter.trim() || undefined,
    }),
    [campaignPage, campaignSearchFilter, campaignStatusFilter],
  )

  const inventoryQuery = useAdminAdsInventoryOverview({ enabled: canRead })
  const slotsQuery = useAdminAdSlots(slotQuery, { enabled: canRead })
  const campaignsQuery = useAdminAdCampaigns(campaignQuery, { enabled: canRead })
  const campaignMetricsQuery = useAdminAdCampaignMetrics(
    selectedCampaignId,
    Math.max(1, toInt(metricsDays, 30)),
    {
      enabled: canRead && Boolean(selectedCampaignId),
    },
  )

  const createSlotMutation = useCreateAdminAdSlot()
  const updateSlotMutation = useUpdateAdminAdSlot()
  const createCampaignMutation = useCreateAdminAdCampaign()
  const updateCampaignMutation = useUpdateAdminAdCampaign()
  const submitCampaignMutation = useSubmitAdminAdCampaignForApproval()
  const approveCampaignMutation = useApproveAdminAdCampaign()
  const rejectCampaignMutation = useRejectAdminAdCampaign()
  const activateCampaignMutation = useActivateAdminAdCampaign()
  const pauseCampaignMutation = usePauseAdminAdCampaign()

  const selectedSlot =
    selectedSlotId && slotsQuery.data
      ? (slotsQuery.data.items.find((item) => item.slotId === selectedSlotId) ?? null)
      : null

  const selectedCampaign =
    selectedCampaignId && campaignsQuery.data
      ? (campaignsQuery.data.items.find((item) => item.id === selectedCampaignId) ?? null)
      : null

  const handleCreateSlot = async () => {
    if (!canWrite) return
    if (!slotReason.trim()) {
      toast.error('Motivo obrigatorio para criar slot.')
      return
    }

    try {
      const result = await createSlotMutation.mutateAsync({
        slotId: slotIdInput,
        label: slotLabelInput,
        surface: slotSurfaceInput,
        position: slotPositionInput,
        device: slotDeviceInput,
        allowedTypes: parseAdTypes(slotAllowedTypesInput),
        visibleTo: parseVisibility(slotVisibleToInput),
        reason: slotReason.trim(),
        note: slotNote.trim() || undefined,
      })
      toast.success(result.message)
      setSelectedSlotId(result.item.slotId)
      setSlotReason('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleToggleSlotActive = async () => {
    if (!canWrite || !selectedSlot) return
    if (!slotReason.trim()) {
      toast.error('Motivo obrigatorio para atualizar slot.')
      return
    }

    try {
      const result = await updateSlotMutation.mutateAsync({
        slotId: selectedSlot.slotId,
        payload: {
          isActive: !selectedSlot.isActive,
          reason: slotReason.trim(),
          note: slotNote.trim() || undefined,
        },
      })
      toast.success(result.message)
      setSlotReason('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleCreateCampaign = async () => {
    if (!canWrite) return
    if (!campaignReason.trim()) {
      toast.error('Motivo obrigatorio para criar campanha.')
      return
    }
    if (!campaignTitleInput.trim() || !campaignHeadlineInput.trim()) {
      toast.error('Title e headline sao obrigatorios.')
      return
    }

    try {
      const result = await createCampaignMutation.mutateAsync({
        code: campaignCodeInput.trim() || undefined,
        title: campaignTitleInput,
        headline: campaignHeadlineInput,
        adType: campaignAdTypeInput,
        sponsorType: campaignSponsorInput,
        directoryEntryId: campaignDirectoryEntryIdInput.trim() || undefined,
        slotIds: parseCsv(campaignSlotIdsInput),
        surfaces: parseSurfaces(campaignSurfacesInput),
        visibleTo: parseVisibility(campaignVisibleToInput),
        relevanceTags: parseCsv(campaignRelevanceTagsInput),
        priority: Math.max(0, toInt(campaignPriorityInput, 100)),
        reason: campaignReason.trim(),
        note: campaignNote.trim() || undefined,
      })
      toast.success(result.message)
      setSelectedCampaignId(result.item.id)
      setCampaignReason('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleUpdateCampaignPriority = async () => {
    if (!canWrite || !selectedCampaignId) return
    if (!campaignReason.trim()) {
      toast.error('Motivo obrigatorio para atualizar campanha.')
      return
    }

    try {
      const result = await updateCampaignMutation.mutateAsync({
        campaignId: selectedCampaignId,
        payload: {
          priority: Math.max(0, toInt(campaignPriorityInput, 100)),
          reason: campaignReason.trim(),
          note: campaignNote.trim() || undefined,
        },
      })
      toast.success(result.message)
      setCampaignReason('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleCampaignStatusAction = async (
    action: 'submit' | 'approve' | 'reject' | 'activate' | 'pause',
  ) => {
    if (!canWrite || !selectedCampaignId) return
    if (!campaignReason.trim()) {
      toast.error('Motivo obrigatorio para alterar status.')
      return
    }

    const payload = {
      reason: campaignReason.trim(),
      note: campaignNote.trim() || undefined,
    }

    try {
      const result =
        action === 'submit'
          ? await submitCampaignMutation.mutateAsync({ campaignId: selectedCampaignId, payload })
          : action === 'approve'
            ? await approveCampaignMutation.mutateAsync({ campaignId: selectedCampaignId, payload })
            : action === 'reject'
              ? await rejectCampaignMutation.mutateAsync({ campaignId: selectedCampaignId, payload })
              : action === 'activate'
                ? await activateCampaignMutation.mutateAsync({
                    campaignId: selectedCampaignId,
                    payload,
                  })
                : await pauseCampaignMutation.mutateAsync({ campaignId: selectedCampaignId, payload })

      toast.success(result.message)
      setCampaignReason('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Anuncios e partnerships</h1>
          <p className="text-sm text-muted-foreground">
            Inventory map, governanca de slots e workflow de campanhas.
          </p>
        </div>
      ) : null}

      <AdminOperationsNav active="ads" />

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de anuncios (`admin.content.read`).
          </CardContent>
        </Card>
      ) : null}

      {canRead ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inventory overview</CardTitle>
              <CardDescription>
                Snapshot: {formatDateTime(inventoryQuery.data?.generatedAt ?? null)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inventoryQuery.refetch().catch(() => undefined)}
                  disabled={inventoryQuery.isFetching}
                >
                  <RefreshCw className={cn('h-4 w-4', inventoryQuery.isFetching && 'animate-spin')} />
                  Atualizar overview
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 rounded border border-border/70 p-3 text-sm">
                  <p className="font-medium">Slots por surface</p>
                  {(inventoryQuery.data?.slotsBySurface ?? []).map((row) => (
                    <p key={`slot-${row.key}`}>
                      {row.key}: {row.total} total / {row.active ?? 0} ativos
                    </p>
                  ))}
                </div>
                <div className="space-y-2 rounded border border-border/70 p-3 text-sm">
                  <p className="font-medium">Campanhas por tipo</p>
                  {(inventoryQuery.data?.campaignsByType ?? []).map((row) => (
                    <p key={`campaign-${row.key}`}>
                      {row.key}: {row.total}
                    </p>
                  ))}
                </div>
                <div className="space-y-2 rounded border border-border/70 p-3 text-sm">
                  <p className="font-medium">Ativas por surface</p>
                  {(inventoryQuery.data?.activeCampaignsBySurface ?? []).map((row) => (
                    <p key={`active-${row.key}`}>
                      {row.key}: {row.total}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Slots</CardTitle>
                <CardDescription>
                  Total: {slotsQuery.data?.pagination.total ?? 0} | Pagina{' '}
                  {slotsQuery.data?.pagination.page ?? 1}/{slotsQuery.data?.pagination.pages ?? 1}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Surface</Label>
                    <Select
                      value={slotSurfaceFilter}
                      onValueChange={(value) => {
                        setSlotSurfaceFilter(value as typeof slotSurfaceFilter)
                        setSlotPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {ADMIN_AD_SURFACES.map((surface) => (
                          <SelectItem key={surface} value={surface}>
                            {SURFACE_LABEL[surface]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Device</Label>
                    <Select
                      value={slotDeviceFilter}
                      onValueChange={(value) => {
                        setSlotDeviceFilter(value as typeof slotDeviceFilter)
                        setSlotPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {ADMIN_AD_DEVICES.map((device) => (
                          <SelectItem key={device} value={device}>
                            {DEVICE_LABEL[device]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={slotActiveFilter}
                      onValueChange={(value) => {
                        setSlotActiveFilter(value as typeof slotActiveFilter)
                        setSlotPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="true">Ativo</SelectItem>
                        <SelectItem value="false">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  {(slotsQuery.data?.items ?? []).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(
                        'w-full rounded border p-2 text-left text-sm',
                        selectedSlotId === item.slotId
                          ? 'border-primary/60 bg-primary/5'
                          : 'border-border/70 hover:border-primary/40',
                      )}
                      onClick={() => setSelectedSlotId(item.slotId)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{item.slotId}</span>
                        <Badge variant={item.isActive ? 'secondary' : 'outline'}>
                          {item.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {SURFACE_LABEL[item.surface]} / {POSITION_LABEL[item.position]} /{' '}
                        {DEVICE_LABEL[item.device]}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={(slotsQuery.data?.pagination.page ?? 1) <= 1}
                    onClick={() => setSlotPage((current) => Math.max(1, current - 1))}
                  >
                    Pagina anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      (slotsQuery.data?.pagination.page ?? 1) >=
                      (slotsQuery.data?.pagination.pages ?? 1)
                    }
                    onClick={() => setSlotPage((current) => current + 1)}
                  >
                    Proxima pagina
                  </Button>
                </div>

                <div className="rounded border border-border/70 p-3">
                  <p className="mb-2 text-sm font-medium">Criar slot</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      placeholder="slotId"
                      value={slotIdInput}
                      onChange={(event) => setSlotIdInput(event.target.value)}
                    />
                    <Input
                      placeholder="label"
                      value={slotLabelInput}
                      onChange={(event) => setSlotLabelInput(event.target.value)}
                    />
                    <Select
                      value={slotSurfaceInput}
                      onValueChange={(value) => setSlotSurfaceInput(value as AdminAdSurface)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_AD_SURFACES.map((surface) => (
                          <SelectItem key={surface} value={surface}>
                            {SURFACE_LABEL[surface]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={slotPositionInput}
                      onValueChange={(value) => setSlotPositionInput(value as AdminAdPosition)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_AD_POSITIONS.map((position) => (
                          <SelectItem key={position} value={position}>
                            {POSITION_LABEL[position]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={slotDeviceInput}
                      onValueChange={(value) => setSlotDeviceInput(value as AdminAdDevice)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_AD_DEVICES.map((device) => (
                          <SelectItem key={device} value={device}>
                            {DEVICE_LABEL[device]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="allowedTypes CSV"
                      value={slotAllowedTypesInput}
                      onChange={(event) => setSlotAllowedTypesInput(event.target.value)}
                    />
                    <Input
                      placeholder="visibleTo CSV"
                      value={slotVisibleToInput}
                      onChange={(event) => setSlotVisibleToInput(event.target.value)}
                    />
                    <Input
                      placeholder="motivo obrigatorio"
                      value={slotReason}
                      onChange={(event) => setSlotReason(event.target.value)}
                    />
                    <Input
                      placeholder="nota"
                      value={slotNote}
                      onChange={(event) => setSlotNote(event.target.value)}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleCreateSlot()}
                      disabled={!canWrite || createSlotMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                      Criar slot
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleToggleSlotActive()}
                      disabled={!canWrite || !selectedSlot || updateSlotMutation.isPending}
                    >
                      {selectedSlot?.isActive ? 'Desativar slot' : 'Ativar slot'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campanhas</CardTitle>
                <CardDescription>
                  Total: {campaignsQuery.data?.pagination.total ?? 0} | Pagina{' '}
                  {campaignsQuery.data?.pagination.page ?? 1}/{campaignsQuery.data?.pagination.pages ?? 1}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={campaignStatusFilter}
                      onValueChange={(value) => {
                        setCampaignStatusFilter(value as typeof campaignStatusFilter)
                        setCampaignPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {ADMIN_AD_CAMPAIGN_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {CAMPAIGN_STATUS_LABEL[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <Input
                      value={campaignSearchFilter}
                      onChange={(event) => {
                        setCampaignSearchFilter(event.target.value)
                        setCampaignPage(1)
                      }}
                      placeholder="code, title, headline"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {(campaignsQuery.data?.items ?? []).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(
                        'w-full rounded border p-2 text-left text-sm',
                        selectedCampaignId === item.id
                          ? 'border-primary/60 bg-primary/5'
                          : 'border-border/70 hover:border-primary/40',
                      )}
                      onClick={() => {
                        setSelectedCampaignId(item.id)
                        setCampaignPriorityInput(String(item.priority))
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{item.code}</span>
                        <Badge variant={CAMPAIGN_STATUS_BADGE[item.status]}>
                          {CAMPAIGN_STATUS_LABEL[item.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {AD_TYPE_LABEL[item.adType]} / {SPONSOR_LABEL[item.sponsorType]} / prio {item.priority}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={(campaignsQuery.data?.pagination.page ?? 1) <= 1}
                    onClick={() => setCampaignPage((current) => Math.max(1, current - 1))}
                  >
                    Pagina anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      (campaignsQuery.data?.pagination.page ?? 1) >=
                      (campaignsQuery.data?.pagination.pages ?? 1)
                    }
                    onClick={() => setCampaignPage((current) => current + 1)}
                  >
                    Proxima pagina
                  </Button>
                </div>

                <div className="rounded border border-border/70 p-3">
                  <p className="mb-2 text-sm font-medium">Criar campanha</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      placeholder="code (opcional)"
                      value={campaignCodeInput}
                      onChange={(event) => setCampaignCodeInput(event.target.value)}
                    />
                    <Input
                      placeholder="title"
                      value={campaignTitleInput}
                      onChange={(event) => setCampaignTitleInput(event.target.value)}
                    />
                    <Input
                      placeholder="headline"
                      value={campaignHeadlineInput}
                      onChange={(event) => setCampaignHeadlineInput(event.target.value)}
                    />
                    <Select
                      value={campaignAdTypeInput}
                      onValueChange={(value) => setCampaignAdTypeInput(value as AdminAdType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_AD_TYPES.map((adType) => (
                          <SelectItem key={adType} value={adType}>
                            {AD_TYPE_LABEL[adType]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={campaignSponsorInput}
                      onValueChange={(value) => setCampaignSponsorInput(value as AdminAdSponsorType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_AD_SPONSOR_TYPES.map((sponsorType) => (
                          <SelectItem key={sponsorType} value={sponsorType}>
                            {SPONSOR_LABEL[sponsorType]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="directoryEntryId"
                      value={campaignDirectoryEntryIdInput}
                      onChange={(event) => setCampaignDirectoryEntryIdInput(event.target.value)}
                    />
                    <Input
                      placeholder="slotIds CSV"
                      value={campaignSlotIdsInput}
                      onChange={(event) => setCampaignSlotIdsInput(event.target.value)}
                    />
                    <Input
                      placeholder="surfaces CSV"
                      value={campaignSurfacesInput}
                      onChange={(event) => setCampaignSurfacesInput(event.target.value)}
                    />
                    <Input
                      placeholder="visibleTo CSV"
                      value={campaignVisibleToInput}
                      onChange={(event) => setCampaignVisibleToInput(event.target.value)}
                    />
                    <Input
                      placeholder="relevanceTags CSV"
                      value={campaignRelevanceTagsInput}
                      onChange={(event) => setCampaignRelevanceTagsInput(event.target.value)}
                    />
                    <Input
                      placeholder="priority"
                      type="number"
                      min={0}
                      value={campaignPriorityInput}
                      onChange={(event) => setCampaignPriorityInput(event.target.value)}
                    />
                    <Input
                      placeholder="motivo obrigatorio"
                      value={campaignReason}
                      onChange={(event) => setCampaignReason(event.target.value)}
                    />
                    <Input
                      placeholder="nota"
                      value={campaignNote}
                      onChange={(event) => setCampaignNote(event.target.value)}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleCreateCampaign()}
                      disabled={!canWrite || createCampaignMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                      Criar campanha
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleUpdateCampaignPriority()}
                      disabled={!canWrite || !selectedCampaignId || updateCampaignMutation.isPending}
                    >
                      Atualizar prioridade
                    </Button>
                  </div>
                </div>

                <div className="rounded border border-border/70 p-3">
                  <p className="mb-2 text-sm font-medium">Workflow de status</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleCampaignStatusAction('submit')}
                      disabled={!canWrite || !selectedCampaignId || submitCampaignMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                      Submit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleCampaignStatusAction('approve')}
                      disabled={!canWrite || !selectedCampaignId || approveCampaignMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleCampaignStatusAction('reject')}
                      disabled={!canWrite || !selectedCampaignId || rejectCampaignMutation.isPending}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleCampaignStatusAction('activate')}
                      disabled={!canWrite || !selectedCampaignId || activateCampaignMutation.isPending}
                    >
                      <PlayCircle className="h-4 w-4" />
                      Activate
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleCampaignStatusAction('pause')}
                      disabled={!canWrite || !selectedCampaignId || pauseCampaignMutation.isPending}
                    >
                      <PauseCircle className="h-4 w-4" />
                      Pause
                    </Button>
                  </div>
                </div>

                <div className="rounded border border-border/70 p-3">
                  <div className="mb-2 flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="campaign-metrics-days">Janela (dias)</Label>
                      <Input
                        id="campaign-metrics-days"
                        type="number"
                        min={1}
                        value={metricsDays}
                        onChange={(event) => setMetricsDays(event.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => campaignMetricsQuery.refetch().catch(() => undefined)}
                      disabled={!selectedCampaignId || campaignMetricsQuery.isFetching}
                    >
                      <BarChart3 className="h-4 w-4" />
                      Metrics
                    </Button>
                  </div>

                  {selectedCampaign ? (
                    <p className="mb-2 text-xs text-muted-foreground">
                      Selecionada: {selectedCampaign.code} ({CAMPAIGN_STATUS_LABEL[selectedCampaign.status]})
                    </p>
                  ) : (
                    <p className="mb-2 text-xs text-muted-foreground">Seleciona uma campanha.</p>
                  )}

                  {campaignMetricsQuery.data ? (
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <p>Impressions: {campaignMetricsQuery.data.lifetime.impressions.toLocaleString('pt-PT')}</p>
                      <p>Clicks: {campaignMetricsQuery.data.lifetime.clicks.toLocaleString('pt-PT')}</p>
                      <p>CTR: {campaignMetricsQuery.data.lifetime.ctrPercent.toFixed(2)}%</p>
                      <p>Fill rate: {campaignMetricsQuery.data.window.fillRatePercent.toFixed(2)}%</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guardrails de negocio</CardTitle>
              <CardDescription>Regras operacionais obrigatorias para ads.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
              <p className="rounded border border-border/70 p-2">
                Premium remove apenas `external_ads`; sponsored/house seguem em slots dedicados.
              </p>
              <p className="rounded border border-border/70 p-2">
                Free nao usa popups/interstitials; apenas slots de bordo e blocos nao intrusivos.
              </p>
              <p className="rounded border border-border/70 p-2">
                Campanhas nao-house exigem `disclosureLabel` e `relevanceTags` financeiras/contextuais.
              </p>
              <p className="rounded border border-border/70 p-2">
                Todas as acoes administrativas exigem motivo para auditoria e rastreabilidade.
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}


