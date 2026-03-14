import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  ADMIN_AD_SURFACES,
  type AdminAdCampaignStatus,
  type AdminAdSurface,
} from '@/features/admin/types/adminAdPartnership'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import {
  useBrandPortalAffiliateLinkClicks,
  useBrandPortalAffiliateLinks,
  useBrandPortalCampaignMetrics,
  useBrandPortalCampaigns,
  useBrandPortalDirectories,
  useBrandPortalIntegrationApiKeyUsage,
  useBrandPortalIntegrationApiKeys,
  useBrandPortalOverview,
  useBrandPortalWalletTransactions,
  useBrandPortalWallets,
  useCreateBrandPortalAffiliateLink,
  useCreateBrandPortalCampaign,
  useCreateBrandPortalIntegrationApiKey,
  useRequestBrandPortalWalletTopUp,
  useRevokeBrandPortalIntegrationApiKey,
  useSubmitBrandPortalCampaignForApproval,
} from '../hooks/useBrandPortal'
import type { BrandWalletTransactionStatus, BrandWalletTransactionType } from '../types/brandPortal'

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' }).format(parsed)
}

const toMoney = (value: number, currency = 'EUR') =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency }).format(value)

const parseCsv = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const AD_SURFACE_SET = new Set<AdminAdSurface>(ADMIN_AD_SURFACES)

export default function BrandPortalPage() {
  const [overviewDays, setOverviewDays] = useState('30')
  const overview = useBrandPortalOverview(Math.max(1, Number.parseInt(overviewDays, 10) || 30))
  const directoriesQuery = useBrandPortalDirectories()
  const directories = useMemo(() => directoriesQuery.data?.items ?? [], [directoriesQuery.data?.items])

  const [walletDirectoryId, setWalletDirectoryId] = useState<string | null>(null)
  const [walletTxType, setWalletTxType] = useState<'all' | BrandWalletTransactionType>('all')
  const [walletTxStatus, setWalletTxStatus] = useState<'all' | BrandWalletTransactionStatus>('all')
  const [topUpAmount, setTopUpAmount] = useState('')
  const wallets = useBrandPortalWallets()
  const walletTransactions = useBrandPortalWalletTransactions(
    walletDirectoryId,
    {
      type: walletTxType === 'all' ? undefined : walletTxType,
      status: walletTxStatus === 'all' ? undefined : walletTxStatus,
      page: 1,
      limit: 8,
    },
    { enabled: Boolean(walletDirectoryId) },
  )
  const topUpMutation = useRequestBrandPortalWalletTopUp()

  const [campaignDirectoryId, setCampaignDirectoryId] = useState('')
  const [campaignTitle, setCampaignTitle] = useState('')
  const [campaignHeadline, setCampaignHeadline] = useState('')
  const [campaignSlots, setCampaignSlots] = useState('')
  const [campaignSurfaces, setCampaignSurfaces] = useState('directory')
  const [campaignBudget, setCampaignBudget] = useState('')
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<'all' | AdminAdCampaignStatus>(
    'all',
  )
  const campaigns = useBrandPortalCampaigns({
    status: campaignStatusFilter === 'all' ? undefined : campaignStatusFilter,
    page: 1,
    limit: 10,
  })
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const campaignMetrics = useBrandPortalCampaignMetrics(selectedCampaignId, 30, {
    enabled: Boolean(selectedCampaignId),
  })
  const createCampaignMutation = useCreateBrandPortalCampaign()
  const submitCampaignMutation = useSubmitBrandPortalCampaignForApproval()

  const [affiliateDirectoryId, setAffiliateDirectoryId] = useState('')
  const [affiliateDestinationUrl, setAffiliateDestinationUrl] = useState('')
  const [affiliateLabel, setAffiliateLabel] = useState('')
  const affiliateLinks = useBrandPortalAffiliateLinks({ page: 1, limit: 10 })
  const [selectedAffiliateLinkId, setSelectedAffiliateLinkId] = useState<string | null>(null)
  const affiliateClicks = useBrandPortalAffiliateLinkClicks(
    selectedAffiliateLinkId,
    { days: 30, page: 1, limit: 20 },
    { enabled: Boolean(selectedAffiliateLinkId) },
  )
  const createAffiliateMutation = useCreateBrandPortalAffiliateLink()

  const [integrationDirectoryId, setIntegrationDirectoryId] = useState('')
  const [integrationLabel, setIntegrationLabel] = useState('')
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null)
  const integrationKeys = useBrandPortalIntegrationApiKeys({ page: 1, limit: 10 })
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
  const integrationUsage = useBrandPortalIntegrationApiKeyUsage(
    selectedKeyId,
    { days: 30, page: 1, limit: 20 },
    { enabled: Boolean(selectedKeyId) },
  )
  const createIntegrationMutation = useCreateBrandPortalIntegrationApiKey()
  const revokeIntegrationMutation = useRevokeBrandPortalIntegrationApiKey()

  useEffect(() => {
    if (!walletDirectoryId && directories.length > 0) setWalletDirectoryId(directories[0].id)
    if (!campaignDirectoryId && directories.length > 0) setCampaignDirectoryId(directories[0].id)
    if (!affiliateDirectoryId && directories.length > 0) setAffiliateDirectoryId(directories[0].id)
    if (!integrationDirectoryId && directories.length > 0) setIntegrationDirectoryId(directories[0].id)
  }, [affiliateDirectoryId, campaignDirectoryId, directories, integrationDirectoryId, walletDirectoryId])

  useEffect(() => {
    if (!selectedCampaignId && (campaigns.data?.items?.length ?? 0) > 0) {
      setSelectedCampaignId(campaigns.data?.items[0]?.id ?? null)
    }
    if (!selectedAffiliateLinkId && (affiliateLinks.data?.items?.length ?? 0) > 0) {
      setSelectedAffiliateLinkId(affiliateLinks.data?.items[0]?.id ?? null)
    }
    if (!selectedKeyId && (integrationKeys.data?.items?.length ?? 0) > 0) {
      setSelectedKeyId(integrationKeys.data?.items[0]?.id ?? null)
    }
  }, [
    affiliateLinks.data?.items,
    campaigns.data?.items,
    integrationKeys.data?.items,
    selectedAffiliateLinkId,
    selectedCampaignId,
    selectedKeyId,
  ])

  const selectedCampaign = useMemo(
    () => campaigns.data?.items.find((item) => item.id === selectedCampaignId) ?? null,
    [campaigns.data?.items, selectedCampaignId],
  )

  const createTopUp = async () => {
    if (!walletDirectoryId) return
    const amount = Number.parseFloat(topUpAmount.replace(',', '.'))
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Valor de top-up invalido.')
      return
    }
    try {
      await topUpMutation.mutateAsync({ directoryEntryId: walletDirectoryId, payload: { amount } })
      toast.success('Pedido de top-up criado.')
      setTopUpAmount('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const createCampaign = async () => {
    if (!campaignDirectoryId || !campaignTitle.trim() || !campaignHeadline.trim()) {
      toast.error('Preenche diretorio, titulo e headline.')
      return
    }
    const slotIds = parseCsv(campaignSlots)
    if (slotIds.length === 0) {
      toast.error('Indica pelo menos um slotId.')
      return
    }
    const surfaces = parseCsv(campaignSurfaces).filter((item): item is AdminAdSurface =>
      AD_SURFACE_SET.has(item as AdminAdSurface),
    )
    if (surfaces.length === 0) {
      toast.error('Indica surfaces validas (ex.: directory,content).')
      return
    }

    try {
      await createCampaignMutation.mutateAsync({
        directoryEntryId: campaignDirectoryId,
        title: campaignTitle.trim(),
        headline: campaignHeadline.trim(),
        adType: 'sponsored_ads',
        surfaces,
        slotIds,
        visibleTo: ['all'],
        estimatedMonthlyBudget: campaignBudget ? Number.parseFloat(campaignBudget) : undefined,
      })
      toast.success('Campanha criada.')
      setCampaignTitle('')
      setCampaignHeadline('')
      setCampaignSlots('')
      setCampaignBudget('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitCampaign = async () => {
    if (!selectedCampaignId) return
    try {
      await submitCampaignMutation.mutateAsync({
        campaignId: selectedCampaignId,
        payload: { reason: 'brand_portal_submit_approval' },
      })
      toast.success('Campanha submetida para aprovacao.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const createAffiliate = async () => {
    if (!affiliateDirectoryId || !affiliateDestinationUrl.trim()) {
      toast.error('Preenche diretorio e URL de destino.')
      return
    }
    try {
      await createAffiliateMutation.mutateAsync({
        directoryEntryId: affiliateDirectoryId,
        destinationUrl: affiliateDestinationUrl.trim(),
        label: affiliateLabel.trim() || undefined,
      })
      toast.success('Link de afiliacao criado.')
      setAffiliateDestinationUrl('')
      setAffiliateLabel('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const createIntegrationKey = async () => {
    if (!integrationDirectoryId) {
      toast.error('Seleciona um diretorio.')
      return
    }
    try {
      const response = await createIntegrationMutation.mutateAsync({
        directoryEntryId: integrationDirectoryId,
        label: integrationLabel.trim() || undefined,
      })
      setCreatedApiKey(response.apiKey)
      toast.success('API key criada.')
      setIntegrationLabel('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const revokeIntegrationKey = async () => {
    if (!selectedKeyId) return
    try {
      await revokeIntegrationMutation.mutateAsync(selectedKeyId)
      toast.success('API key revogada.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Portal de Marca</h1>
        <p className="text-sm text-muted-foreground">
          Operacao self-service: wallet, campanhas, afiliacao e integracoes.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="affiliate">Afiliacao</TabsTrigger>
          <TabsTrigger value="integrations">Integracoes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Ownership e delivery agregado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="overview-days">Dias</Label>
                <Input id="overview-days" className="max-w-[100px]" value={overviewDays} onChange={(event) => setOverviewDays(event.target.value)} />
                <Button variant="outline" onClick={() => overview.refetch().catch(() => undefined)}>
                  Atualizar
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <MetricCard label="Diretorios" value={overview.data?.ownership.totalEntries ?? 0} />
                <MetricCard label="Campanhas" value={overview.data?.campaigns.total ?? 0} />
                <MetricCard label="Impressions" value={overview.data?.campaigns.totals.impressions ?? 0} />
                <MetricCard label="CTR" value={`${(overview.data?.campaigns.totals.ctr ?? 0).toFixed(2)}%`} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-4">
                <Select value={walletDirectoryId ?? ''} onValueChange={setWalletDirectoryId}>
                  <SelectTrigger><SelectValue placeholder="Diretorio" /></SelectTrigger>
                  <SelectContent>{directories.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={walletTxType} onValueChange={(value) => setWalletTxType(value as typeof walletTxType)}>
                  <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos tipos</SelectItem>
                    <SelectItem value="top_up">top_up</SelectItem>
                    <SelectItem value="campaign_spend">campaign_spend</SelectItem>
                    <SelectItem value="refund">refund</SelectItem>
                    <SelectItem value="manual_adjustment">manual_adjustment</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={walletTxStatus} onValueChange={(value) => setWalletTxStatus(value as typeof walletTxStatus)}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos status</SelectItem>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="completed">completed</SelectItem>
                    <SelectItem value="failed">failed</SelectItem>
                    <SelectItem value="cancelled">cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Top-up EUR" value={topUpAmount} onChange={(event) => setTopUpAmount(event.target.value)} />
              </div>
              <Button onClick={createTopUp} disabled={topUpMutation.isPending}>Pedir top-up</Button>
              <div className="grid gap-3 md:grid-cols-3">
                <MetricCard label="Saldo total" value={toMoney(wallets.data?.summary.totalBalance ?? 0)} />
                <MetricCard label="Reservado" value={toMoney(wallets.data?.summary.totalReserved ?? 0)} />
                <MetricCard label="Disponivel" value={toMoney(wallets.data?.summary.totalAvailable ?? 0)} />
              </div>
              <SimpleList
                title="Ultimas transacoes"
                rows={(walletTransactions.data?.items ?? []).map((item) => `${formatDateTime(item.createdAt)} | ${item.type} | ${item.status} | ${toMoney(item.amount, item.currency)}`)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader><CardTitle>Campanhas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-3">
                <Select value={campaignDirectoryId} onValueChange={setCampaignDirectoryId}>
                  <SelectTrigger><SelectValue placeholder="Diretorio" /></SelectTrigger>
                  <SelectContent>{directories.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Titulo" value={campaignTitle} onChange={(event) => setCampaignTitle(event.target.value)} />
                <Input placeholder="Headline" value={campaignHeadline} onChange={(event) => setCampaignHeadline(event.target.value)} />
                <Input placeholder="Surfaces CSV" value={campaignSurfaces} onChange={(event) => setCampaignSurfaces(event.target.value)} />
                <Input placeholder="Slot IDs CSV" value={campaignSlots} onChange={(event) => setCampaignSlots(event.target.value)} />
                <Input placeholder="Budget mensal EUR" value={campaignBudget} onChange={(event) => setCampaignBudget(event.target.value)} />
              </div>
              <Button onClick={createCampaign} disabled={createCampaignMutation.isPending}>Criar campanha</Button>
              <div className="grid gap-2 md:grid-cols-2">
                <Select value={campaignStatusFilter} onValueChange={setCampaignStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="Filtro status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="pending_approval">pending_approval</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="paused">paused</SelectItem>
                    <SelectItem value="completed">completed</SelectItem>
                    <SelectItem value="rejected">rejected</SelectItem>
                    <SelectItem value="archived">archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => campaigns.refetch().catch(() => undefined)}>Atualizar lista</Button>
              </div>
              <div className="space-y-2">
                {(campaigns.data?.items ?? []).map((item) => (
                  <button key={item.id} type="button" className={`w-full rounded border p-2 text-left ${selectedCampaignId === item.id ? 'bg-muted' : ''}`} onClick={() => setSelectedCampaignId(item.id)}>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.code}</Badge>
                      <span>{item.title}</span>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={submitCampaign} disabled={!selectedCampaignId || submitCampaignMutation.isPending}>Submeter selecionada</Button>
              </div>
              {selectedCampaign && (
                <SimpleList
                  title="Metricas da campanha selecionada"
                  rows={[
                    `Impressions: ${campaignMetrics.data?.lifetime.impressions ?? 0}`,
                    `Clicks: ${campaignMetrics.data?.lifetime.clicks ?? 0}`,
                    `CTR: ${(campaignMetrics.data?.lifetime.ctrPercent ?? 0).toFixed(2)}%`,
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliate">
          <Card>
            <CardHeader><CardTitle>Afiliacao</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-3">
                <Select value={affiliateDirectoryId} onValueChange={setAffiliateDirectoryId}>
                  <SelectTrigger><SelectValue placeholder="Diretorio" /></SelectTrigger>
                  <SelectContent>{directories.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Destination URL" value={affiliateDestinationUrl} onChange={(event) => setAffiliateDestinationUrl(event.target.value)} />
                <Input placeholder="Label opcional" value={affiliateLabel} onChange={(event) => setAffiliateLabel(event.target.value)} />
              </div>
              <Button onClick={createAffiliate} disabled={createAffiliateMutation.isPending}>Criar link afiliado</Button>
              <div className="space-y-2">
                {(affiliateLinks.data?.items ?? []).map((item) => (
                  <button key={item.id} type="button" className={`w-full rounded border p-2 text-left ${selectedAffiliateLinkId === item.id ? 'bg-muted' : ''}`} onClick={() => setSelectedAffiliateLinkId(item.id)}>
                    <span className="font-medium">{item.code}</span> - {item.directoryEntry.name} - clicks: {item.metrics.clicks}
                  </button>
                ))}
              </div>
              <SimpleList
                title="Clicks do link selecionado"
                rows={(affiliateClicks.data?.items ?? []).map((item) => `${formatDateTime(item.clickedAt)} | converted: ${item.converted ? 'yes' : 'no'} | valueCents: ${item.conversionValueCents ?? '-'}`)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader><CardTitle>Integracoes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-3">
                <Select value={integrationDirectoryId} onValueChange={setIntegrationDirectoryId}>
                  <SelectTrigger><SelectValue placeholder="Diretorio" /></SelectTrigger>
                  <SelectContent>{directories.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Label opcional" value={integrationLabel} onChange={(event) => setIntegrationLabel(event.target.value)} />
                <Button onClick={createIntegrationKey} disabled={createIntegrationMutation.isPending}>Criar API key</Button>
              </div>
              {createdApiKey && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">API key (mostrar uma vez)</CardTitle></CardHeader>
                  <CardContent><code className="block overflow-x-auto rounded bg-muted px-2 py-1 text-xs">{createdApiKey}</code></CardContent>
                </Card>
              )}
              <div className="space-y-2">
                {(integrationKeys.data?.items ?? []).map((item) => (
                  <button key={item.id} type="button" className={`w-full rounded border p-2 text-left ${selectedKeyId === item.id ? 'bg-muted' : ''}`} onClick={() => setSelectedKeyId(item.id)}>
                    <span className="font-medium">{item.keyPrefix}</span> - {item.isActive ? 'ativo' : 'inativo'} - uso: {formatDateTime(item.lastUsedAt)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={revokeIntegrationKey} disabled={!selectedKeyId || revokeIntegrationMutation.isPending}>Revogar selecionada</Button>
                <Button variant="outline" onClick={() => integrationUsage.refetch().catch(() => undefined)} disabled={!selectedKeyId}>Atualizar usage</Button>
              </div>
              <SimpleList
                title="Usage da API key selecionada"
                rows={(integrationUsage.data?.items ?? []).map((item) => `${formatDateTime(item.createdAt)} | ${item.method} ${item.path} | ${item.statusCode} | ${item.durationMs}ms`)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

function SimpleList({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {rows.map((row, index) => (
            <li key={`${title}-${index}`} className="rounded border px-2 py-1">
              {row}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
