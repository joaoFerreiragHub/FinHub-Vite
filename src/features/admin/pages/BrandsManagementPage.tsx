import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import {
  Archive,
  Edit3,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Upload,
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
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import {
  useAdminDirectories,
  useArchiveAdminDirectory,
  useCreateAdminDirectory,
  usePublishAdminDirectory,
  useUpdateAdminDirectory,
} from '../hooks/useAdminDirectories'
import type {
  AdminDirectoryCreateInput,
  AdminDirectoryEntry,
  AdminDirectoryListQuery,
  AdminDirectoryStatus,
  AdminDirectoryUpdateInput,
  AdminDirectoryVerificationStatus,
  AdminDirectoryVertical,
} from '../types/adminDirectories'

interface BrandsManagementPageProps {
  embedded?: boolean
}

interface CurrentAdminMeta {
  adminReadOnly?: boolean
  adminScopes?: string[]
}

type StatusFilter = AdminDirectoryStatus | 'all'
type BooleanFilter = 'all' | 'true' | 'false'

interface FilterState {
  search: string
  status: StatusFilter
  isActive: BooleanFilter
  isFeatured: BooleanFilter
  claimable: BooleanFilter
}

interface FormState {
  name: string
  slug: string
  shortDescription: string
  description: string
  website: string
  country: string
  categories: string
  tags: string
  status: AdminDirectoryStatus
  verificationStatus: AdminDirectoryVerificationStatus
  isActive: boolean
  isFeatured: boolean
  showInHomeSection: boolean
  showInDirectory: boolean
  landingEnabled: boolean
  showAllEnabled: boolean
  claimable: boolean
}

interface PublishState {
  entry: AdminDirectoryEntry
  reason: string
}

interface ArchiveState {
  entry: AdminDirectoryEntry
  reason: string
  confirm: string
}

interface EntryFieldsProps {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
  idPrefix: string
}

const PAGE_SIZE = 20
const CONFIRM_TOKEN = 'CONFIRMAR'
const INITIAL_FILTERS: FilterState = {
  search: '',
  status: 'all',
  isActive: 'all',
  isFeatured: 'all',
  claimable: 'all',
}

const DEFAULT_FORM: FormState = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  website: '',
  country: '',
  categories: '',
  tags: '',
  status: 'draft',
  verificationStatus: 'unverified',
  isActive: true,
  isFeatured: false,
  showInHomeSection: false,
  showInDirectory: true,
  landingEnabled: true,
  showAllEnabled: true,
  claimable: false,
}

const VERTICAL_LABEL: Record<AdminDirectoryVertical, string> = {
  broker: 'Corretoras',
  exchange: 'Exchanges',
  site: 'Sites',
  app: 'Apps',
  podcast: 'Podcasts',
  event: 'Eventos',
  other: 'Outros',
}

const STATUS_LABEL: Record<AdminDirectoryStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

const VERIFICATION_LABEL: Record<AdminDirectoryVerificationStatus, string> = {
  unverified: 'Nao verificado',
  pending: 'Pendente',
  verified: 'Verificado',
}

const boolFilterToValue = (value: BooleanFilter): boolean | undefined => {
  if (value === 'all') return undefined
  return value === 'true'
}

const csvToArray = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

const arrayToCsv = (value: string[]): string => value.join(', ')

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const toForm = (entry: AdminDirectoryEntry): FormState => ({
  name: entry.name,
  slug: entry.slug,
  shortDescription: entry.shortDescription,
  description: entry.description ?? '',
  website: entry.website ?? '',
  country: entry.country ?? '',
  categories: arrayToCsv(entry.categories),
  tags: arrayToCsv(entry.tags),
  status: entry.status,
  verificationStatus: entry.verificationStatus,
  isActive: entry.isActive,
  isFeatured: entry.isFeatured,
  showInHomeSection: entry.showInHomeSection,
  showInDirectory: entry.showInDirectory,
  landingEnabled: entry.landingEnabled,
  showAllEnabled: entry.showAllEnabled,
  claimable: entry.claimable,
})

const buildCreateInput = (form: FormState): AdminDirectoryCreateInput => ({
  name: form.name.trim(),
  slug: form.slug.trim() || undefined,
  shortDescription: form.shortDescription.trim(),
  description: form.description.trim() || undefined,
  website: form.website.trim() || undefined,
  country: form.country.trim() || undefined,
  categories: csvToArray(form.categories),
  tags: csvToArray(form.tags),
  status: form.status,
  verificationStatus: form.verificationStatus,
  isActive: form.isActive,
  isFeatured: form.isFeatured,
  showInHomeSection: form.showInHomeSection,
  showInDirectory: form.showInDirectory,
  landingEnabled: form.landingEnabled,
  showAllEnabled: form.showAllEnabled,
  ownerType: 'admin_seeded',
  sourceType: 'internal',
  claimable: form.claimable,
})

const buildUpdateInput = (form: FormState): AdminDirectoryUpdateInput => ({
  name: form.name.trim(),
  slug: form.slug.trim() || undefined,
  shortDescription: form.shortDescription.trim(),
  description: form.description.trim() || undefined,
  website: form.website.trim() || undefined,
  country: form.country.trim() || undefined,
  categories: csvToArray(form.categories),
  tags: csvToArray(form.tags),
  status: form.status,
  verificationStatus: form.verificationStatus,
  isActive: form.isActive,
  isFeatured: form.isFeatured,
  showInHomeSection: form.showInHomeSection,
  showInDirectory: form.showInDirectory,
  landingEnabled: form.landingEnabled,
  showAllEnabled: form.showAllEnabled,
  claimable: form.claimable,
})

function EntryFields({ form, setForm, idPrefix }: EntryFieldsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <Label htmlFor={`${idPrefix}-name`}>Nome *</Label>
        <Input
          id={`${idPrefix}-name`}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-slug`}>Slug</Label>
        <Input
          id={`${idPrefix}-slug`}
          value={form.slug}
          onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor={`${idPrefix}-short`}>Resumo curto *</Label>
        <Textarea
          id={`${idPrefix}-short`}
          rows={2}
          value={form.shortDescription}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, shortDescription: event.target.value }))
          }
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor={`${idPrefix}-description`}>Descricao</Label>
        <Textarea
          id={`${idPrefix}-description`}
          rows={3}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-website`}>Website</Label>
        <Input
          id={`${idPrefix}-website`}
          value={form.website}
          onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-country`}>Pais</Label>
        <Input
          id={`${idPrefix}-country`}
          value={form.country}
          onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-categories`}>Categorias (csv)</Label>
        <Input
          id={`${idPrefix}-categories`}
          value={form.categories}
          onChange={(event) => setForm((prev) => ({ ...prev, categories: event.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-tags`}>Tags (csv)</Label>
        <Input
          id={`${idPrefix}-tags`}
          value={form.tags}
          onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, status: value as AdminDirectoryStatus }))
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Verificacao</Label>
        <Select
          value={form.verificationStatus}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              verificationStatus: value as AdminDirectoryVerificationStatus,
            }))
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unverified">Nao verificado</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="verified">Verificado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
          <Label>isActive</Label>
          <Switch
            checked={form.isActive}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, isActive: Boolean(checked) }))
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
          <Label>isFeatured</Label>
          <Switch
            checked={form.isFeatured}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, isFeatured: Boolean(checked) }))
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
          <Label>showInHomeSection</Label>
          <Switch
            checked={form.showInHomeSection}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, showInHomeSection: Boolean(checked) }))
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
          <Label>showInDirectory</Label>
          <Switch
            checked={form.showInDirectory}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, showInDirectory: Boolean(checked) }))
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
          <Label>landingEnabled</Label>
          <Switch
            checked={form.landingEnabled}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, landingEnabled: Boolean(checked) }))
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
          <Label>showAllEnabled</Label>
          <Switch
            checked={form.showAllEnabled}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, showAllEnabled: Boolean(checked) }))
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
          <Label>claimable</Label>
          <Switch
            checked={form.claimable}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, claimable: Boolean(checked) }))
            }
          />
        </div>
      </div>
    </div>
  )
}

export default function BrandsManagementPage({ embedded = false }: BrandsManagementPageProps) {
  const rawUser = useAuthStore((state) => state.user)
  const user = (rawUser as unknown as CurrentAdminMeta | null) ?? null

  const canRead = useMemo(() => {
    if (!user) return false
    if (!Array.isArray(user.adminScopes) || user.adminScopes.length === 0) return true
    return (
      user.adminScopes.includes('admin.directory.manage') ||
      user.adminScopes.includes('admin.brands.read')
    )
  }, [user])

  const canWrite = useMemo(() => {
    if (!user) return false
    if (user.adminReadOnly) return false
    if (!Array.isArray(user.adminScopes) || user.adminScopes.length === 0) return true
    return (
      user.adminScopes.includes('admin.directory.manage') ||
      user.adminScopes.includes('admin.brands.write')
    )
  }, [user])

  const [vertical, setVertical] = useState<AdminDirectoryVertical>('broker')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [queryFilters, setQueryFilters] = useState(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<FormState>(DEFAULT_FORM)

  const [editEntry, setEditEntry] = useState<AdminDirectoryEntry | null>(null)
  const [editForm, setEditForm] = useState<FormState>(DEFAULT_FORM)

  const [publishState, setPublishState] = useState<PublishState | null>(null)
  const [archiveState, setArchiveState] = useState<ArchiveState | null>(null)

  const query = useMemo(() => {
    const next: AdminDirectoryListQuery = { page, limit: PAGE_SIZE }
    if (queryFilters.search.trim()) next.search = queryFilters.search.trim()
    if (queryFilters.status !== 'all') next.status = queryFilters.status

    const isActive = boolFilterToValue(queryFilters.isActive)
    if (typeof isActive === 'boolean') next.isActive = isActive

    const isFeatured = boolFilterToValue(queryFilters.isFeatured)
    if (typeof isFeatured === 'boolean') next.isFeatured = isFeatured

    const claimable = boolFilterToValue(queryFilters.claimable)
    if (typeof claimable === 'boolean') next.claimable = claimable

    return next
  }, [page, queryFilters])

  const listQuery = useAdminDirectories(vertical, query, { enabled: canRead })
  const createMutation = useCreateAdminDirectory()
  const updateMutation = useUpdateAdminDirectory()
  const publishMutation = usePublishAdminDirectory()
  const archiveMutation = useArchiveAdminDirectory()

  const items = listQuery.data?.items ?? []
  const pagination = listQuery.data?.pagination

  const applyFilters = () => {
    setQueryFilters(filters)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setQueryFilters(INITIAL_FILTERS)
    setPage(1)
  }

  const openEdit = (entry: AdminDirectoryEntry) => {
    setEditEntry(entry)
    setEditForm(toForm(entry))
  }

  const submitCreate = async () => {
    if (!createForm.name.trim() || !createForm.shortDescription.trim()) {
      toast.error('Nome e resumo curto sao obrigatorios.')
      return
    }

    try {
      await createMutation.mutateAsync({ vertical, input: buildCreateInput(createForm) })
      toast.success('Entrada criada com sucesso.')
      setCreateOpen(false)
      setCreateForm(DEFAULT_FORM)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
  const submitEdit = async () => {
    if (!editEntry) return
    if (!editForm.name.trim() || !editForm.shortDescription.trim()) {
      toast.error('Nome e resumo curto sao obrigatorios.')
      return
    }

    try {
      await updateMutation.mutateAsync({
        vertical,
        entryId: editEntry.id,
        input: buildUpdateInput(editForm),
      })
      toast.success('Entrada atualizada com sucesso.')
      setEditEntry(null)
      setEditForm(DEFAULT_FORM)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitPublish = async () => {
    if (!publishState) return
    try {
      await publishMutation.mutateAsync({
        vertical,
        entryId: publishState.entry.id,
        reason: publishState.reason.trim() || undefined,
      })
      toast.success('Entrada publicada.')
      setPublishState(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitArchive = async () => {
    if (!archiveState) return
    if (!archiveState.reason.trim()) {
      toast.error('Motivo obrigatorio para arquivar.')
      return
    }
    if (archiveState.confirm.trim().toUpperCase() !== CONFIRM_TOKEN) {
      toast.error(`Escreve "${CONFIRM_TOKEN}" para confirmar.`)
      return
    }

    try {
      await archiveMutation.mutateAsync({
        vertical,
        entryId: archiveState.entry.id,
        reason: archiveState.reason.trim(),
      })
      toast.success('Entrada arquivada.')
      setArchiveState(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1
          className={
            embedded
              ? 'text-xl font-semibold tracking-tight'
              : 'text-2xl font-semibold tracking-tight'
          }
        >
          {embedded ? 'Diretorios verticais' : 'Gestao de diretorios verticais'}
        </h1>
        <p className="text-sm text-muted-foreground">
          CRUD operacional por vertical com publish/archive.
        </p>
      </div>

      {!canRead ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Perfil atual sem escopo `admin.directory.manage`.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {canRead ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Vertical, estado e flags de listagem.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <div>
                <Label>Vertical</Label>
                <Select
                  value={vertical}
                  onValueChange={(value) => {
                    setVertical(value as AdminDirectoryVertical)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broker">Corretoras</SelectItem>
                    <SelectItem value="exchange">Exchanges</SelectItem>
                    <SelectItem value="site">Sites</SelectItem>
                    <SelectItem value="app">Apps</SelectItem>
                    <SelectItem value="podcast">Podcasts</SelectItem>
                    <SelectItem value="event">Eventos</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="xl:col-span-2">
                <Label htmlFor="directory-search">Pesquisa</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="directory-search"
                    value={filters.search}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, search: event.target.value }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        applyFilters()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={applyFilters}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, status: value as StatusFilter }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>isActive</Label>
                <Select
                  value={filters.isActive}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, isActive: value as BooleanFilter }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Ativos</SelectItem>
                    <SelectItem value="false">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>isFeatured</Label>
                <Select
                  value={filters.isFeatured}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, isFeatured: value as BooleanFilter }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Featured</SelectItem>
                    <SelectItem value="false">Nao featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>claimable</Label>
                <Select
                  value={filters.claimable}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, claimable: value as BooleanFilter }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Claimable</SelectItem>
                    <SelectItem value="false">Nao claimable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 xl:col-span-6 flex flex-wrap gap-2">
                <Button type="button" onClick={applyFilters}>
                  Aplicar filtros
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Limpar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => listQuery.refetch()}
                  disabled={listQuery.isFetching}
                >
                  {listQuery.isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                  Atualizar
                </Button>
                <div className="ml-auto">
                  <Button type="button" onClick={() => setCreateOpen(true)} disabled={!canWrite}>
                    <Plus className="h-4 w-4" />
                    Nova entrada
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diretorio - {VERTICAL_LABEL[vertical]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />A carregar...
                </div>
              ) : listQuery.isError ? (
                <p className="text-sm text-destructive">{getErrorMessage(listQuery.error)}</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem entradas para o filtro atual.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead>Atualizacao</TableHead>
                      <TableHead className="w-[260px]">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">/{item.slug}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'archived' ? 'destructive' : 'outline'}>
                            {STATUS_LABEL[item.status]}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {VERIFICATION_LABEL[item.verificationStatus]}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.isActive ? <Badge variant="outline">Ativo</Badge> : null}
                            {item.isFeatured ? <Badge variant="outline">Featured</Badge> : null}
                            {item.showInHomeSection ? <Badge variant="outline">Home</Badge> : null}
                            {item.showInDirectory ? (
                              <Badge variant="outline">Directory</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <p>{formatDateTime(item.updatedAt)}</p>
                          <p>
                            {item.updatedBy?.name ||
                              item.updatedBy?.username ||
                              item.updatedBy?.email ||
                              'N/A'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={!canWrite}
                              onClick={() => openEdit(item)}
                            >
                              <Edit3 className="h-4 w-4" />
                              Editar
                            </Button>
                            {item.status !== 'published' ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={!canWrite}
                                onClick={() =>
                                  setPublishState({
                                    entry: item,
                                    reason: 'Publicacao administrativa',
                                  })
                                }
                              >
                                <Upload className="h-4 w-4" />
                                Publicar
                              </Button>
                            ) : null}
                            {item.status !== 'archived' ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={!canWrite}
                                onClick={() =>
                                  setArchiveState({
                                    entry: item,
                                    reason: 'Arquivamento administrativo',
                                    confirm: '',
                                  })
                                }
                              >
                                <Archive className="h-4 w-4" />
                                Arquivar
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {pagination && pagination.pages > 1 ? (
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    Pagina {pagination.page} de {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
                    >
                      Seguinte
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </>
      ) : null}

      <Dialog open={createOpen} onOpenChange={(open) => (!open ? setCreateOpen(false) : null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nova entrada</DialogTitle>
            <DialogDescription>Vertical: {VERTICAL_LABEL[vertical]}</DialogDescription>
          </DialogHeader>
          <EntryFields form={createForm} setForm={setCreateForm} idPrefix="create-entry" />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={submitCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editEntry)}
        onOpenChange={(open) => (!open ? setEditEntry(null) : null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar entrada</DialogTitle>
            <DialogDescription>
              {editEntry ? `${editEntry.name} (${editEntry.slug})` : ''}
            </DialogDescription>
          </DialogHeader>
          <EntryFields form={editForm} setForm={setEditForm} idPrefix="edit-entry" />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditEntry(null)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={submitEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(publishState)}
        onOpenChange={(open) => (!open ? setPublishState(null) : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publicar entrada</DialogTitle>
            <DialogDescription>{publishState ? publishState.entry.name : ''}</DialogDescription>
          </DialogHeader>
          <Label htmlFor="publish-reason">Motivo (opcional)</Label>
          <Input
            id="publish-reason"
            value={publishState?.reason ?? ''}
            onChange={(event) =>
              setPublishState((prev) => (prev ? { ...prev, reason: event.target.value } : prev))
            }
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPublishState(null)}
              disabled={publishMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={submitPublish} disabled={publishMutation.isPending}>
              {publishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(archiveState)}
        onOpenChange={(open) => (!open ? setArchiveState(null) : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arquivar entrada</DialogTitle>
            <DialogDescription>{archiveState ? archiveState.entry.name : ''}</DialogDescription>
          </DialogHeader>
          <Label htmlFor="archive-reason">Motivo *</Label>
          <Textarea
            id="archive-reason"
            rows={3}
            value={archiveState?.reason ?? ''}
            onChange={(event) =>
              setArchiveState((prev) => (prev ? { ...prev, reason: event.target.value } : prev))
            }
          />
          <Label htmlFor="archive-confirm">Confirmacao dupla ({CONFIRM_TOKEN})</Label>
          <Input
            id="archive-confirm"
            value={archiveState?.confirm ?? ''}
            onChange={(event) =>
              setArchiveState((prev) => (prev ? { ...prev, confirm: event.target.value } : prev))
            }
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setArchiveState(null)}
              disabled={archiveMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={submitArchive}
              disabled={archiveMutation.isPending}
            >
              {archiveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Arquivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
