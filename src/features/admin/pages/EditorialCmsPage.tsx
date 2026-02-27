import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pin,
  PinOff,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Trash2,
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
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import {
  useAddAdminEditorialSectionItem,
  useAdminEditorialClaims,
  useAdminEditorialHomePreview,
  useAdminOwnershipTransfers,
  useAdminEditorialSections,
  useApproveAdminEditorialClaim,
  useCreateAdminEditorialSection,
  useRejectAdminEditorialClaim,
  useRemoveAdminEditorialSectionItem,
  useReorderAdminEditorialSectionItems,
  useTransferAdminOwnership,
  useUpdateAdminEditorialSection,
} from '../hooks/useAdminEditorialCms'
import type {
  AdminAddEditorialSectionItemInput,
  AdminEditorialClaimStatus,
  AdminEditorialClaimTargetType,
  AdminEditorialClaimActorSummary,
  AdminEditorialSection,
  AdminEditorialSectionItem,
  AdminEditorialSectionItemStatus,
  AdminEditorialSectionItemTargetType,
  AdminEditorialSectionStatus,
  AdminEditorialSectionType,
  AdminOwnershipOwnerType,
  AdminOwnershipTransfersQuery,
} from '../types/adminEditorialCms'

interface EditorialCmsPageProps {
  embedded?: boolean
}

interface CurrentAdminMeta {
  adminReadOnly?: boolean
  adminScopes?: string[]
}

interface SectionFormState {
  key: string
  title: string
  subtitle: string
  description: string
  sectionType: AdminEditorialSectionType
  order: string
  maxItems: string
  status: AdminEditorialSectionStatus
  showOnHome: boolean
  showOnLanding: boolean
  showOnShowAll: boolean
}

interface ItemFormState {
  targetType: AdminEditorialSectionItemTargetType
  targetId: string
  titleOverride: string
  descriptionOverride: string
  imageOverride: string
  urlOverride: string
  badge: string
  sortOrder: string
  isPinned: boolean
  status: AdminEditorialSectionItemStatus
  startAt: string
  endAt: string
}

interface RemoveDialogState {
  sectionId: string
  itemId: string
  itemLabel: string
}

type SectionFilterStatus = AdminEditorialSectionStatus | 'all'
type ClaimFilterStatus = AdminEditorialClaimStatus | 'all'
type ClaimFilterTargetType = AdminEditorialClaimTargetType | 'all'
type OwnershipTransferFilterTargetType = AdminEditorialClaimTargetType | 'all'
type OwnershipTransferFilterOwnerType = AdminOwnershipOwnerType | 'all'

interface OwnershipTransferFormState {
  targetType: AdminEditorialClaimTargetType
  targetId: string
  toOwnerType: AdminOwnershipOwnerType
  toOwnerUserId: string
  reason: string
  note: string
}

interface OwnershipTransferFiltersState {
  targetType: OwnershipTransferFilterTargetType
  fromOwnerType: OwnershipTransferFilterOwnerType
  toOwnerType: OwnershipTransferFilterOwnerType
  targetId: string
  search: string
}

const PAGE_SIZE = 25
const DOUBLE_CONFIRM_TOKEN = 'CONFIRMAR'

const SECTION_TYPE_LABEL: Record<AdminEditorialSectionType, string> = {
  content: 'Conteudo',
  directory: 'Diretorio',
  mixed: 'Misto',
  custom: 'Custom',
}

const SECTION_STATUS_LABEL: Record<AdminEditorialSectionStatus, string> = {
  active: 'Ativa',
  inactive: 'Inativa',
}

const ITEM_TARGET_LABEL: Record<AdminEditorialSectionItemTargetType, string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  live: 'Live',
  podcast: 'Podcast',
  book: 'Livro',
  directory_entry: 'Diretorio',
  external_link: 'Link externo',
  custom: 'Custom',
}

const ITEM_STATUS_LABEL: Record<AdminEditorialSectionItemStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
}

const CLAIM_STATUS_LABEL: Record<AdminEditorialClaimStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
}

const CLAIM_TARGET_LABEL: Record<AdminEditorialClaimTargetType, string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  live: 'Live',
  podcast: 'Podcast',
  book: 'Livro',
  directory_entry: 'Diretorio',
}

const OWNERSHIP_OWNER_LABEL: Record<AdminOwnershipOwnerType, string> = {
  admin_seeded: 'admin_seeded',
  creator_owned: 'creator_owned',
}

const DEFAULT_SECTION_FORM: SectionFormState = {
  key: '',
  title: '',
  subtitle: '',
  description: '',
  sectionType: 'mixed',
  order: '0',
  maxItems: '12',
  status: 'active',
  showOnHome: true,
  showOnLanding: true,
  showOnShowAll: true,
}

const DEFAULT_ITEM_FORM: ItemFormState = {
  targetType: 'custom',
  targetId: '',
  titleOverride: '',
  descriptionOverride: '',
  imageOverride: '',
  urlOverride: '',
  badge: '',
  sortOrder: '',
  isPinned: false,
  status: 'active',
  startAt: '',
  endAt: '',
}

const DEFAULT_TRANSFER_FORM: OwnershipTransferFormState = {
  targetType: 'directory_entry',
  targetId: '',
  toOwnerType: 'creator_owned',
  toOwnerUserId: '',
  reason: '',
  note: '',
}

const DEFAULT_OWNERSHIP_TRANSFER_FILTERS: OwnershipTransferFiltersState = {
  targetType: 'all',
  fromOwnerType: 'all',
  toOwnerType: 'all',
  targetId: '',
  search: '',
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

const formatActorLabel = (actor: AdminEditorialClaimActorSummary | null): string => {
  if (!actor) return '-'
  if (actor.username) return `@${actor.username}`
  if (actor.name) return actor.name
  if (actor.email) return actor.email
  return actor.id
}

const parseOptionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim()
  if (trimmed.length === 0) return undefined
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) return undefined
  return parsed
}

const parseOptionalIsoDate = (value: string): string | undefined => {
  const trimmed = value.trim()
  if (trimmed.length === 0) return undefined
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString()
}

const toSectionPayload = (form: SectionFormState) => ({
  key: form.key,
  title: form.title,
  subtitle: form.subtitle,
  description: form.description,
  sectionType: form.sectionType,
  order: parseOptionalNumber(form.order),
  maxItems: parseOptionalNumber(form.maxItems),
  status: form.status,
  showOnHome: form.showOnHome,
  showOnLanding: form.showOnLanding,
  showOnShowAll: form.showOnShowAll,
})

const toItemPayload = (form: ItemFormState): AdminAddEditorialSectionItemInput => ({
  targetType: form.targetType,
  targetId: form.targetId,
  titleOverride: form.titleOverride,
  descriptionOverride: form.descriptionOverride,
  imageOverride: form.imageOverride,
  urlOverride: form.urlOverride,
  badge: form.badge,
  sortOrder: parseOptionalNumber(form.sortOrder),
  isPinned: form.isPinned,
  status: form.status,
  startAt: parseOptionalIsoDate(form.startAt),
  endAt: parseOptionalIsoDate(form.endAt),
})

const fromSection = (section: AdminEditorialSection): SectionFormState => ({
  key: section.key,
  title: section.title,
  subtitle: section.subtitle ?? '',
  description: section.description ?? '',
  sectionType: section.sectionType,
  order: String(section.order),
  maxItems: String(section.maxItems),
  status: section.status,
  showOnHome: section.showOnHome,
  showOnLanding: section.showOnLanding,
  showOnShowAll: section.showOnShowAll,
})

const cloneItems = (items: AdminEditorialSectionItem[]): AdminEditorialSectionItem[] =>
  items.map((item) => ({ ...item }))

const isSameDraft = (
  source: AdminEditorialSectionItem[],
  draft: AdminEditorialSectionItem[] | undefined,
): boolean => {
  if (!draft) return true
  if (source.length !== draft.length) return false

  return source.every((item, index) => {
    const candidate = draft[index]
    return (
      candidate &&
      item.id === candidate.id &&
      item.sortOrder === candidate.sortOrder &&
      item.isPinned === candidate.isPinned &&
      item.status === candidate.status
    )
  })
}

export default function EditorialCmsPage({ embedded = false }: EditorialCmsPageProps) {
  const rawAuthUser = useAuthStore((state) => state.user)
  const authUser = (rawAuthUser as unknown as CurrentAdminMeta | null) ?? null

  const adminScopes = Array.isArray(authUser?.adminScopes) ? authUser.adminScopes : []
  const hasExplicitScopes = adminScopes.length > 0
  const hasScope = (scope: string): boolean => !hasExplicitScopes || adminScopes.includes(scope)

  const canReadEditorial = Boolean(authUser && hasScope('admin.home.curate'))
  const canWriteEditorial = Boolean(
    authUser && !authUser.adminReadOnly && hasScope('admin.home.curate'),
  )
  const canReadClaims = Boolean(
    authUser && (hasScope('admin.claim.review') || hasScope('admin.claim.transfer')),
  )
  const canWriteClaimReview = Boolean(
    authUser && !authUser.adminReadOnly && hasScope('admin.claim.review'),
  )
  const canWriteOwnershipTransfer = Boolean(
    authUser && !authUser.adminReadOnly && hasScope('admin.claim.transfer'),
  )
  const canReadAnyEditorial = canReadEditorial || canReadClaims

  const [filters, setFilters] = useState<{ status: SectionFilterStatus; search: string }>({
    status: 'all',
    search: '',
  })
  const [queryFilters, setQueryFilters] = useState<{ status: SectionFilterStatus; search: string }>(
    {
      status: 'all',
      search: '',
    },
  )
  const [page, setPage] = useState(1)

  const [claimFilters, setClaimFilters] = useState<{
    status: ClaimFilterStatus
    targetType: ClaimFilterTargetType
  }>({
    status: 'all',
    targetType: 'all',
  })
  const [claimQueryFilters, setClaimQueryFilters] = useState<{
    status: ClaimFilterStatus
    targetType: ClaimFilterTargetType
  }>({
    status: 'all',
    targetType: 'all',
  })
  const [claimPage, setClaimPage] = useState(1)
  const [claimActionNote, setClaimActionNote] = useState('')
  const [transferForm, setTransferForm] =
    useState<OwnershipTransferFormState>(DEFAULT_TRANSFER_FORM)
  const [ownershipTransferFilters, setOwnershipTransferFilters] =
    useState<OwnershipTransferFiltersState>(DEFAULT_OWNERSHIP_TRANSFER_FILTERS)
  const [ownershipTransferQueryFilters, setOwnershipTransferQueryFilters] =
    useState<OwnershipTransferFiltersState>(DEFAULT_OWNERSHIP_TRANSFER_FILTERS)
  const [ownershipTransferPage, setOwnershipTransferPage] = useState(1)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState<SectionFormState>(DEFAULT_SECTION_FORM)

  const [editDialogSection, setEditDialogSection] = useState<AdminEditorialSection | null>(null)
  const [editForm, setEditForm] = useState<SectionFormState>(DEFAULT_SECTION_FORM)

  const [addItemSection, setAddItemSection] = useState<AdminEditorialSection | null>(null)
  const [addItemForm, setAddItemForm] = useState<ItemFormState>(DEFAULT_ITEM_FORM)

  const [removeDialogState, setRemoveDialogState] = useState<RemoveDialogState | null>(null)
  const [removeConfirmText, setRemoveConfirmText] = useState('')

  const [draftItemsBySection, setDraftItemsBySection] = useState<
    Record<string, AdminEditorialSectionItem[]>
  >({})

  const query = useMemo(() => {
    const nextQuery: {
      page: number
      limit: number
      status?: AdminEditorialSectionStatus
      search?: string
    } = {
      page,
      limit: PAGE_SIZE,
    }

    if (queryFilters.status !== 'all') nextQuery.status = queryFilters.status
    if (queryFilters.search.trim().length > 0) nextQuery.search = queryFilters.search.trim()

    return nextQuery
  }, [page, queryFilters])

  const claimQuery = useMemo(() => {
    const nextQuery: {
      page: number
      limit: number
      status?: AdminEditorialClaimStatus
      targetType?: AdminEditorialClaimTargetType
    } = {
      page: claimPage,
      limit: PAGE_SIZE,
    }

    if (claimQueryFilters.status !== 'all') nextQuery.status = claimQueryFilters.status
    if (claimQueryFilters.targetType !== 'all') nextQuery.targetType = claimQueryFilters.targetType

    return nextQuery
  }, [claimPage, claimQueryFilters])

  const ownershipTransferQuery = useMemo(() => {
    const nextQuery: AdminOwnershipTransfersQuery = {
      page: ownershipTransferPage,
      limit: PAGE_SIZE,
    }

    if (ownershipTransferQueryFilters.targetType !== 'all') {
      nextQuery.targetType = ownershipTransferQueryFilters.targetType
    }
    if (ownershipTransferQueryFilters.fromOwnerType !== 'all') {
      nextQuery.fromOwnerType = ownershipTransferQueryFilters.fromOwnerType
    }
    if (ownershipTransferQueryFilters.toOwnerType !== 'all') {
      nextQuery.toOwnerType = ownershipTransferQueryFilters.toOwnerType
    }
    if (ownershipTransferQueryFilters.targetId.trim().length > 0) {
      nextQuery.targetId = ownershipTransferQueryFilters.targetId.trim()
    }
    if (ownershipTransferQueryFilters.search.trim().length > 0) {
      nextQuery.search = ownershipTransferQueryFilters.search.trim()
    }

    return nextQuery
  }, [ownershipTransferPage, ownershipTransferQueryFilters])

  const sectionsQuery = useAdminEditorialSections(query, { enabled: canReadEditorial })
  const homePreviewQuery = useAdminEditorialHomePreview({ enabled: canReadEditorial })
  const claimsQuery = useAdminEditorialClaims(claimQuery, { enabled: canReadClaims })
  const ownershipTransfersQuery = useAdminOwnershipTransfers(ownershipTransferQuery, {
    enabled: canReadClaims,
  })

  const createSectionMutation = useCreateAdminEditorialSection()
  const updateSectionMutation = useUpdateAdminEditorialSection()
  const addItemMutation = useAddAdminEditorialSectionItem()
  const reorderMutation = useReorderAdminEditorialSectionItems()
  const removeItemMutation = useRemoveAdminEditorialSectionItem()
  const approveClaimMutation = useApproveAdminEditorialClaim()
  const rejectClaimMutation = useRejectAdminEditorialClaim()
  const transferOwnershipMutation = useTransferAdminOwnership()

  const sectionsData = sectionsQuery.data?.items
  const sections = useMemo(() => sectionsData ?? [], [sectionsData])
  const pagination = sectionsQuery.data?.pagination
  const claimsData = claimsQuery.data?.items
  const claims = useMemo(() => claimsData ?? [], [claimsData])
  const claimPagination = claimsQuery.data?.pagination
  const ownershipTransfersData = ownershipTransfersQuery.data?.items
  const ownershipTransfers = useMemo(() => ownershipTransfersData ?? [], [ownershipTransfersData])
  const ownershipTransfersPagination = ownershipTransfersQuery.data?.pagination

  const totalItems = useMemo(
    () => sections.reduce((acc, section) => acc + section.items.length, 0),
    [sections],
  )
  const activeSections = useMemo(
    () => sections.filter((section) => section.status === 'active').length,
    [sections],
  )
  const homeVisibleSections = useMemo(
    () => sections.filter((section) => section.showOnHome).length,
    [sections],
  )
  const pendingClaims = useMemo(
    () => claims.filter((claim) => claim.status === 'pending').length,
    [claims],
  )

  const setSectionDraft = (
    section: AdminEditorialSection,
    updater: (items: AdminEditorialSectionItem[]) => AdminEditorialSectionItem[],
  ) => {
    setDraftItemsBySection((prev) => {
      const current = prev[section.id] ? cloneItems(prev[section.id]) : cloneItems(section.items)
      return {
        ...prev,
        [section.id]: updater(current),
      }
    })
  }

  const getWorkingItems = (section: AdminEditorialSection): AdminEditorialSectionItem[] =>
    draftItemsBySection[section.id] ?? section.items

  const clearSectionDraft = (sectionId: string) => {
    setDraftItemsBySection((prev) => {
      if (!prev[sectionId]) return prev
      const next = { ...prev }
      delete next[sectionId]
      return next
    })
  }

  const hasDraftChanges = (section: AdminEditorialSection): boolean =>
    !isSameDraft(section.items, draftItemsBySection[section.id])

  const applyFilters = () => {
    setQueryFilters(filters)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ status: 'all', search: '' })
    setQueryFilters({ status: 'all', search: '' })
    setPage(1)
  }

  const applyClaimFilters = () => {
    setClaimQueryFilters(claimFilters)
    setClaimPage(1)
  }

  const clearClaimFilters = () => {
    setClaimFilters({ status: 'all', targetType: 'all' })
    setClaimQueryFilters({ status: 'all', targetType: 'all' })
    setClaimPage(1)
  }

  const applyOwnershipTransferFilters = () => {
    setOwnershipTransferQueryFilters(ownershipTransferFilters)
    setOwnershipTransferPage(1)
  }

  const clearOwnershipTransferFilters = () => {
    setOwnershipTransferFilters(DEFAULT_OWNERSHIP_TRANSFER_FILTERS)
    setOwnershipTransferQueryFilters(DEFAULT_OWNERSHIP_TRANSFER_FILTERS)
    setOwnershipTransferPage(1)
  }

  const openEditDialog = (section: AdminEditorialSection) => {
    setEditDialogSection(section)
    setEditForm(fromSection(section))
  }

  const closeCreateDialog = () => {
    if (createSectionMutation.isPending) return
    setCreateDialogOpen(false)
    setCreateForm(DEFAULT_SECTION_FORM)
  }

  const closeEditDialog = () => {
    if (updateSectionMutation.isPending) return
    setEditDialogSection(null)
    setEditForm(DEFAULT_SECTION_FORM)
  }

  const closeAddItemDialog = () => {
    if (addItemMutation.isPending) return
    setAddItemSection(null)
    setAddItemForm(DEFAULT_ITEM_FORM)
  }

  const closeRemoveDialog = () => {
    if (removeItemMutation.isPending) return
    setRemoveDialogState(null)
    setRemoveConfirmText('')
  }

  const submitCreateSection = async () => {
    const title = createForm.title.trim()
    if (!title) {
      toast.error('Titulo obrigatorio para criar secao.')
      return
    }

    try {
      await createSectionMutation.mutateAsync({
        ...toSectionPayload(createForm),
        title,
      })
      toast.success('Secao editorial criada com sucesso.')
      closeCreateDialog()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitEditSection = async () => {
    if (!editDialogSection) return

    const title = editForm.title.trim()
    if (!title) {
      toast.error('Titulo obrigatorio para atualizar secao.')
      return
    }

    try {
      await updateSectionMutation.mutateAsync({
        sectionId: editDialogSection.id,
        input: {
          ...toSectionPayload(editForm),
          title,
        },
      })
      toast.success('Secao editorial atualizada.')
      closeEditDialog()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitAddItem = async () => {
    if (!addItemSection) return
    if (addItemForm.targetId.trim().length === 0) {
      toast.error('targetId obrigatorio para adicionar item.')
      return
    }

    if (addItemSection.items.length >= addItemSection.maxItems) {
      toast.error('A secao ja atingiu o limite maximo de itens. Ajusta maxItems ou remove itens.')
      return
    }

    try {
      await addItemMutation.mutateAsync({
        sectionId: addItemSection.id,
        input: toItemPayload(addItemForm),
      })
      toast.success('Item editorial adicionado.')
      closeAddItemDialog()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const saveSectionReorder = async (section: AdminEditorialSection) => {
    const draft = draftItemsBySection[section.id]
    if (!draft) return

    try {
      await reorderMutation.mutateAsync({
        sectionId: section.id,
        payload: {
          items: draft.map((item, index) => ({
            itemId: item.id,
            sortOrder: index,
            isPinned: item.isPinned,
            status: item.status,
          })),
        },
      })
      toast.success('Ordem e estado dos itens atualizados.')
      clearSectionDraft(section.id)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const moveItem = (section: AdminEditorialSection, index: number, direction: 'up' | 'down') => {
    setSectionDraft(section, (items) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= items.length) return items

      const next = cloneItems(items)
      const current = next[index]
      next[index] = next[targetIndex]
      next[targetIndex] = current
      return next.map((item, currentIndex) => ({ ...item, sortOrder: currentIndex }))
    })
  }

  const togglePinned = (section: AdminEditorialSection, index: number) => {
    setSectionDraft(section, (items) => {
      const next = cloneItems(items)
      next[index] = { ...next[index], isPinned: !next[index].isPinned }
      return next
    })
  }

  const toggleStatus = (section: AdminEditorialSection, index: number) => {
    setSectionDraft(section, (items) => {
      const next = cloneItems(items)
      next[index] = {
        ...next[index],
        status: next[index].status === 'active' ? 'inactive' : 'active',
      }
      return next
    })
  }

  const confirmRemoveItem = async () => {
    if (!removeDialogState) return
    if (removeConfirmText.trim().toUpperCase() !== DOUBLE_CONFIRM_TOKEN) {
      toast.error(`Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar a remocao.`)
      return
    }

    try {
      await removeItemMutation.mutateAsync({
        sectionId: removeDialogState.sectionId,
        itemId: removeDialogState.itemId,
      })
      toast.success('Item removido da secao.')
      closeRemoveDialog()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const approveClaim = async (claimId: string) => {
    try {
      const result = await approveClaimMutation.mutateAsync({
        claimId,
        note: claimActionNote,
      })
      toast.success(`Claim aprovado. Transfer log: ${result.transfer.transferLogId}`)
      setClaimActionNote('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const rejectClaim = async (claimId: string) => {
    try {
      await rejectClaimMutation.mutateAsync({
        claimId,
        note: claimActionNote,
      })
      toast.success('Claim rejeitado.')
      setClaimActionNote('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitOwnershipTransfer = async () => {
    if (transferForm.targetId.trim().length === 0) {
      toast.error('targetId obrigatorio para transferir ownership.')
      return
    }
    if (transferForm.reason.trim().length === 0) {
      toast.error('Motivo obrigatorio para transferir ownership.')
      return
    }
    if (
      transferForm.toOwnerType === 'creator_owned' &&
      transferForm.toOwnerUserId.trim().length === 0
    ) {
      toast.error('toOwnerUserId obrigatorio quando destino e creator_owned.')
      return
    }

    try {
      const result = await transferOwnershipMutation.mutateAsync({
        targetType: transferForm.targetType,
        targetId: transferForm.targetId,
        toOwnerType: transferForm.toOwnerType,
        toOwnerUserId:
          transferForm.toOwnerType === 'creator_owned' ? transferForm.toOwnerUserId : null,
        reason: transferForm.reason,
        note: transferForm.note,
      })
      toast.success(`Ownership transferido. Log: ${result.transferLogId}`)
      setTransferForm((prev) => ({
        ...DEFAULT_TRANSFER_FORM,
        targetType: prev.targetType,
        toOwnerType: prev.toOwnerType,
      }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const renderTitle = embedded ? 'Editorial CMS' : 'Editorial CMS - Curadoria da Home'
  const renderDescription = embedded
    ? 'Gestao de secoes, claims e ownership editorial.'
    : 'Operacao de secoes dinamicas, claims e preview publico da homepage curada.'

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
          {renderTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{renderDescription}</p>
      </div>

      {!canReadAnyEditorial && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Perfil atual sem escopo para este modulo (`admin.home.curate`, `admin.claim.review` ou
              `admin.claim.transfer`).
            </p>
          </CardContent>
        </Card>
      )}

      {canReadAnyEditorial &&
      !canWriteEditorial &&
      !canWriteClaimReview &&
      !canWriteOwnershipTransfer ? (
        <Card className="border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-yellow-600" />
            <p className="text-sm text-muted-foreground">
              Perfil em modo read-only. Tens acesso a consulta, mas sem executar acoes de escrita.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {canReadAnyEditorial ? (
        <>
          {canReadEditorial ? (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Secoes (filtro atual)</CardDescription>
                  <CardTitle className="text-2xl">{pagination?.total ?? 0}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Secoes ativas</CardDescription>
                  <CardTitle className="text-2xl">{activeSections}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Itens no lote</CardDescription>
                  <CardTitle className="text-2xl">{totalItems}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Com visibilidade Home</CardDescription>
                  <CardTitle className="text-2xl">{homeVisibleSections}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          ) : null}

          {canReadEditorial ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Filtros de secao</CardTitle>
                  <CardDescription>Pesquisa por key/titulo e estado da secao.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                  <div className="xl:col-span-3">
                    <Label htmlFor="editorial-search">Pesquisa</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        id="editorial-search"
                        value={filters.search}
                        onChange={(event) =>
                          setFilters((prev) => ({ ...prev, search: event.target.value }))
                        }
                        placeholder="Titulo, key, subtitulo ou descricao"
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
                    <Label>Estado</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, status: value as SectionFilterStatus }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="inactive">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 xl:col-span-2 flex flex-wrap gap-2 self-end">
                    <Button type="button" onClick={applyFilters}>
                      Aplicar filtros
                    </Button>
                    <Button type="button" variant="outline" onClick={clearFilters}>
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        sectionsQuery.refetch()
                        homePreviewQuery.refetch()
                      }}
                      disabled={sectionsQuery.isFetching || homePreviewQuery.isFetching}
                    >
                      {sectionsQuery.isFetching || homePreviewQuery.isFetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="h-4 w-4" />
                      )}
                      Atualizar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCreateDialogOpen(true)}
                      disabled={!canWriteEditorial}
                    >
                      <Plus className="h-4 w-4" />
                      Nova secao
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Secoes editoriais</CardTitle>
                  <CardDescription>
                    Opera metadata da secao e a lista de itens com reorder/pin/status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sectionsQuery.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />A carregar secoes editoriais...
                    </div>
                  ) : sectionsQuery.isError ? (
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                      {getErrorMessage(sectionsQuery.error)}
                    </div>
                  ) : sections.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Sem secoes para os filtros atuais.
                      </p>
                    </div>
                  ) : (
                    sections.map((section) => {
                      const workingItems = getWorkingItems(section)
                      const dirty = hasDraftChanges(section)

                      return (
                        <div key={section.id} className="rounded-lg border border-border/70 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-base font-semibold">{section.title}</p>
                                <Badge variant="outline">{section.key}</Badge>
                                <Badge variant="outline">
                                  {SECTION_TYPE_LABEL[section.sectionType]}
                                </Badge>
                                <Badge
                                  variant={section.status === 'active' ? 'secondary' : 'outline'}
                                >
                                  {SECTION_STATUS_LABEL[section.status]}
                                </Badge>
                                {section.showOnHome ? (
                                  <Badge className="bg-green-600 text-white hover:bg-green-600">
                                    Home on
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Home off</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {section.description || 'Sem descricao adicional.'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Itens: {workingItems.length}/{section.maxItems} | Ordem secao:{' '}
                                {section.order} | Atualizada: {formatDateTime(section.updatedAt)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(section)}
                                disabled={!canWriteEditorial}
                              >
                                Editar secao
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setAddItemSection(section)}
                                disabled={
                                  !canWriteEditorial || workingItems.length >= section.maxItems
                                }
                              >
                                Adicionar item
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => saveSectionReorder(section)}
                                disabled={!canWriteEditorial || !dirty || reorderMutation.isPending}
                              >
                                Guardar ordem
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => clearSectionDraft(section.id)}
                                disabled={!dirty || reorderMutation.isPending}
                              >
                                Descartar
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            {workingItems.length === 0 ? (
                              <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                                Secao sem itens.
                              </p>
                            ) : (
                              workingItems.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="grid gap-2 rounded-md border border-border/70 bg-muted/10 p-3 md:grid-cols-12"
                                >
                                  <div className="md:col-span-7">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge variant="outline">
                                        {ITEM_TARGET_LABEL[item.targetType]}
                                      </Badge>
                                      <Badge
                                        variant={item.status === 'active' ? 'secondary' : 'outline'}
                                      >
                                        {ITEM_STATUS_LABEL[item.status]}
                                      </Badge>
                                      {item.isPinned ? (
                                        <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                                          Pinned
                                        </Badge>
                                      ) : null}
                                    </div>
                                    <p className="mt-2 text-sm font-medium">
                                      {item.titleOverride || item.targetId}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Target: {item.targetType} / {item.targetId}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      sortOrder: {item.sortOrder} | Janela:{' '}
                                      {formatDateTime(item.startAt)} - {formatDateTime(item.endAt)}
                                    </p>
                                  </div>

                                  <div className="md:col-span-5 flex flex-wrap items-center justify-start gap-2 md:justify-end">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => moveItem(section, index, 'up')}
                                      disabled={!canWriteEditorial || index === 0}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => moveItem(section, index, 'down')}
                                      disabled={
                                        !canWriteEditorial || index === workingItems.length - 1
                                      }
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => togglePinned(section, index)}
                                      disabled={!canWriteEditorial}
                                    >
                                      {item.isPinned ? (
                                        <>
                                          <PinOff className="h-4 w-4" />
                                          Unpin
                                        </>
                                      ) : (
                                        <>
                                          <Pin className="h-4 w-4" />
                                          Pin
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => toggleStatus(section, index)}
                                      disabled={!canWriteEditorial}
                                    >
                                      {item.status === 'active' ? 'Inativar' : 'Ativar'}
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        setRemoveDialogState({
                                          sectionId: section.id,
                                          itemId: item.id,
                                          itemLabel: item.titleOverride || item.targetId,
                                        })
                                      }
                                      disabled={!canWriteEditorial}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Remover
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )
                    })
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
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                          Anterior
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={pagination.page >= pagination.pages}
                          onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
                        >
                          Seguinte
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview publico da Home</CardTitle>
                  <CardDescription>Snapshot direto de `GET /api/editorial/home`.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {homePreviewQuery.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />A carregar preview...
                    </div>
                  ) : homePreviewQuery.isError ? (
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                      {getErrorMessage(homePreviewQuery.error)}
                    </div>
                  ) : (homePreviewQuery.data?.items.length ?? 0) === 0 ? (
                    <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Sem secoes visiveis na Home neste momento.
                    </p>
                  ) : (
                    homePreviewQuery.data?.items.map((section) => (
                      <div key={section.id} className="rounded-md border border-border/70 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">{section.title}</p>
                          <Badge variant="outline">{section.key}</Badge>
                          <Badge variant="outline">{SECTION_TYPE_LABEL[section.sectionType]}</Badge>
                          <Badge variant="secondary">
                            {section.items.length}/{section.maxItems} itens
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {section.subtitle || section.description || 'Sem resumo adicional.'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {section.items.slice(0, 6).map((item) => (
                            <Badge key={item.id} variant="outline" className="text-[10px]">
                              {ITEM_TARGET_LABEL[item.targetType]}:{' '}
                              {item.titleOverride || item.targetId.slice(0, 24)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}

          {canReadClaims ? (
            <Card>
              <CardHeader>
                <CardTitle>Claims e ownership</CardTitle>
                <CardDescription>
                  Revisao de claims (`/api/admin/claims`) e transfer manual de ownership.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Pendentes: {pendingClaims}</Badge>
                  <Badge variant="outline">Total no filtro: {claimPagination?.total ?? 0}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => claimsQuery.refetch()}
                    disabled={claimsQuery.isFetching}
                  >
                    {claimsQuery.isFetching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                    Atualizar
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                  <div>
                    <Label>Estado</Label>
                    <Select
                      value={claimFilters.status}
                      onValueChange={(value) =>
                        setClaimFilters((prev) => ({ ...prev, status: value as ClaimFilterStatus }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Target type</Label>
                    <Select
                      value={claimFilters.targetType}
                      onValueChange={(value) =>
                        setClaimFilters((prev) => ({
                          ...prev,
                          targetType: value as ClaimFilterTargetType,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="directory_entry">Diretorio</SelectItem>
                        <SelectItem value="article">Artigo</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="course">Curso</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="book">Livro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 xl:col-span-2 flex flex-wrap gap-2 self-end">
                    <Button type="button" onClick={applyClaimFilters}>
                      Aplicar filtros
                    </Button>
                    <Button type="button" variant="outline" onClick={clearClaimFilters}>
                      Limpar
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="claim-action-note">Nota para aprovar/rejeitar (opcional)</Label>
                  <Textarea
                    id="claim-action-note"
                    rows={2}
                    value={claimActionNote}
                    onChange={(event) => setClaimActionNote(event.target.value)}
                    placeholder="Nota operacional para a revisao do claim"
                  />
                </div>

                {claimsQuery.isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />A carregar claims...
                  </div>
                ) : claimsQuery.isError ? (
                  <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                    {getErrorMessage(claimsQuery.error)}
                  </div>
                ) : claims.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Sem claims para os filtros atuais.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {claims.map((claim) => (
                      <div key={claim.id} className="rounded-md border border-border/70 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">
                                {CLAIM_TARGET_LABEL[claim.targetType]}
                              </Badge>
                              <Badge
                                variant={
                                  claim.status === 'approved'
                                    ? 'secondary'
                                    : claim.status === 'rejected'
                                      ? 'destructive'
                                      : 'outline'
                                }
                              >
                                {CLAIM_STATUS_LABEL[claim.status]}
                              </Badge>
                              <Badge variant="outline">ID: {claim.targetId}</Badge>
                            </div>
                            <p className="text-sm">{claim.reason}</p>
                            <p className="text-xs text-muted-foreground">
                              creator: @{claim.creator?.username ?? claim.creator?.id ?? '-'} |
                              pedido: {formatDateTime(claim.createdAt)} | revisao:{' '}
                              {formatDateTime(claim.reviewedAt)}
                            </p>
                          </div>
                          {claim.status === 'pending' ? (
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => approveClaim(claim.id)}
                                disabled={!canWriteClaimReview || approveClaimMutation.isPending}
                              >
                                Aprovar
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => rejectClaim(claim.id)}
                                disabled={!canWriteClaimReview || rejectClaimMutation.isPending}
                              >
                                Rejeitar
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {claimPagination && claimPagination.pages > 1 ? (
                      <div className="flex items-center justify-between border-t border-border pt-2">
                        <p className="text-sm text-muted-foreground">
                          Pagina {claimPagination.page} de {claimPagination.pages}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={claimPagination.page <= 1}
                            onClick={() => setClaimPage((prev) => Math.max(1, prev - 1))}
                          >
                            Anterior
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={claimPagination.page >= claimPagination.pages}
                            onClick={() =>
                              setClaimPage((prev) => Math.min(claimPagination.pages, prev + 1))
                            }
                          >
                            Seguinte
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="rounded-md border border-border/70 p-3">
                  <p className="text-sm font-medium">Transfer ownership manual</p>
                  <p className="text-xs text-muted-foreground">
                    Endpoint: `POST /api/admin/ownership/transfer`.
                  </p>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <Label>Target type</Label>
                      <Select
                        value={transferForm.targetType}
                        onValueChange={(value) =>
                          setTransferForm((prev) => ({
                            ...prev,
                            targetType: value as AdminEditorialClaimTargetType,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="directory_entry">Diretorio</SelectItem>
                          <SelectItem value="article">Artigo</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="course">Curso</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="podcast">Podcast</SelectItem>
                          <SelectItem value="book">Livro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="transfer-target-id">Target ID</Label>
                      <Input
                        id="transfer-target-id"
                        value={transferForm.targetId}
                        onChange={(event) =>
                          setTransferForm((prev) => ({ ...prev, targetId: event.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Destino</Label>
                      <Select
                        value={transferForm.toOwnerType}
                        onValueChange={(value) =>
                          setTransferForm((prev) => ({
                            ...prev,
                            toOwnerType: value as AdminOwnershipOwnerType,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creator_owned">creator_owned</SelectItem>
                          <SelectItem value="admin_seeded">admin_seeded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="transfer-owner-user">toOwnerUserId</Label>
                      <Input
                        id="transfer-owner-user"
                        value={transferForm.toOwnerUserId}
                        onChange={(event) =>
                          setTransferForm((prev) => ({
                            ...prev,
                            toOwnerUserId: event.target.value,
                          }))
                        }
                        placeholder={
                          transferForm.toOwnerType === 'creator_owned'
                            ? 'Obrigatorio para creator_owned'
                            : 'Opcional'
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="transfer-reason">Motivo</Label>
                      <Input
                        id="transfer-reason"
                        value={transferForm.reason}
                        onChange={(event) =>
                          setTransferForm((prev) => ({ ...prev, reason: event.target.value }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="transfer-note">Nota (opcional)</Label>
                      <Textarea
                        id="transfer-note"
                        rows={2}
                        value={transferForm.note}
                        onChange={(event) =>
                          setTransferForm((prev) => ({ ...prev, note: event.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <Button
                      type="button"
                      onClick={submitOwnershipTransfer}
                      disabled={!canWriteOwnershipTransfer || transferOwnershipMutation.isPending}
                    >
                      {transferOwnershipMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      Transferir ownership
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border border-border/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">Historico de ownership transfer</p>
                      <p className="text-xs text-muted-foreground">
                        Endpoint: `GET /api/admin/ownership/transfers`.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        Total no filtro: {ownershipTransfersPagination?.total ?? 0}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => ownershipTransfersQuery.refetch()}
                        disabled={ownershipTransfersQuery.isFetching}
                      >
                        {ownershipTransfersQuery.isFetching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCcw className="h-4 w-4" />
                        )}
                        Atualizar
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                    <div>
                      <Label>Target type</Label>
                      <Select
                        value={ownershipTransferFilters.targetType}
                        onValueChange={(value) =>
                          setOwnershipTransferFilters((prev) => ({
                            ...prev,
                            targetType: value as OwnershipTransferFilterTargetType,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="directory_entry">Diretorio</SelectItem>
                          <SelectItem value="article">Artigo</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="course">Curso</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="podcast">Podcast</SelectItem>
                          <SelectItem value="book">Livro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Owner origem</Label>
                      <Select
                        value={ownershipTransferFilters.fromOwnerType}
                        onValueChange={(value) =>
                          setOwnershipTransferFilters((prev) => ({
                            ...prev,
                            fromOwnerType: value as OwnershipTransferFilterOwnerType,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="admin_seeded">admin_seeded</SelectItem>
                          <SelectItem value="creator_owned">creator_owned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Owner destino</Label>
                      <Select
                        value={ownershipTransferFilters.toOwnerType}
                        onValueChange={(value) =>
                          setOwnershipTransferFilters((prev) => ({
                            ...prev,
                            toOwnerType: value as OwnershipTransferFilterOwnerType,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="admin_seeded">admin_seeded</SelectItem>
                          <SelectItem value="creator_owned">creator_owned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ownership-target-id">Target ID</Label>
                      <Input
                        id="ownership-target-id"
                        value={ownershipTransferFilters.targetId}
                        onChange={(event) =>
                          setOwnershipTransferFilters((prev) => ({
                            ...prev,
                            targetId: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="ownership-search">Pesquisa</Label>
                      <div className="relative mt-1">
                        <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="ownership-search"
                          value={ownershipTransferFilters.search}
                          onChange={(event) =>
                            setOwnershipTransferFilters((prev) => ({
                              ...prev,
                              search: event.target.value,
                            }))
                          }
                          className="pl-8"
                          placeholder="reason, note ou targetId"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 self-end">
                      <Button type="button" onClick={applyOwnershipTransferFilters}>
                        Aplicar filtros
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearOwnershipTransferFilters}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3">
                    {ownershipTransfersQuery.isLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />A carregar historico...
                      </div>
                    ) : ownershipTransfersQuery.isError ? (
                      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                        {getErrorMessage(ownershipTransfersQuery.error)}
                      </div>
                    ) : ownershipTransfers.length === 0 ? (
                      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        Sem registos de ownership transfer para os filtros atuais.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {ownershipTransfers.map((transfer) => (
                          <div key={transfer.id} className="rounded-md border border-border/70 p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">
                                {CLAIM_TARGET_LABEL[transfer.targetType]}
                              </Badge>
                              <Badge variant="outline">ID: {transfer.targetId}</Badge>
                              <Badge variant="secondary">
                                {OWNERSHIP_OWNER_LABEL[transfer.fromOwnerType]} -&gt;{' '}
                                {OWNERSHIP_OWNER_LABEL[transfer.toOwnerType]}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm">{transfer.reason}</p>
                            {transfer.note ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Nota: {transfer.note}
                              </p>
                            ) : null}
                            <p className="mt-1 text-xs text-muted-foreground">
                              de: {formatActorLabel(transfer.fromOwnerUser)} | para:{' '}
                              {formatActorLabel(transfer.toOwnerUser)} | por:{' '}
                              {formatActorLabel(transfer.transferredBy)} | em:{' '}
                              {formatDateTime(transfer.createdAt)}
                            </p>
                          </div>
                        ))}

                        {ownershipTransfersPagination && ownershipTransfersPagination.pages > 1 ? (
                          <div className="flex items-center justify-between border-t border-border pt-2">
                            <p className="text-sm text-muted-foreground">
                              Pagina {ownershipTransfersPagination.page} de{' '}
                              {ownershipTransfersPagination.pages}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={ownershipTransfersPagination.page <= 1}
                                onClick={() =>
                                  setOwnershipTransferPage((prev) => Math.max(1, prev - 1))
                                }
                              >
                                Anterior
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={
                                  ownershipTransfersPagination.page >=
                                  ownershipTransfersPagination.pages
                                }
                                onClick={() =>
                                  setOwnershipTransferPage((prev) =>
                                    Math.min(ownershipTransfersPagination.pages, prev + 1),
                                  )
                                }
                              >
                                Seguinte
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : null}

      <Dialog open={createDialogOpen} onOpenChange={(open) => (!open ? closeCreateDialog() : null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Criar secao editorial</DialogTitle>
            <DialogDescription>Define metadata da secao e flags de visibilidade.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="section-title">Titulo</Label>
              <Input
                id="section-title"
                value={createForm.title}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="section-key">Key (opcional)</Label>
              <Input
                id="section-key"
                value={createForm.key}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, key: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select
                value={createForm.sectionType}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    sectionType: value as AdminEditorialSectionType,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Misto</SelectItem>
                  <SelectItem value="content">Conteudo</SelectItem>
                  <SelectItem value="directory">Diretorio</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="section-subtitle">Subtitulo</Label>
              <Input
                id="section-subtitle"
                value={createForm.subtitle}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, subtitle: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="section-order">Ordem</Label>
              <Input
                id="section-order"
                value={createForm.order}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, order: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="section-max-items">Max items</Label>
              <Input
                id="section-max-items"
                value={createForm.maxItems}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, maxItems: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Select
                value={createForm.status}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    status: value as AdminEditorialSectionStatus,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="section-description">Descricao</Label>
              <Textarea
                id="section-description"
                rows={3}
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2 grid gap-2 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
                <Label htmlFor="create-show-home">showOnHome</Label>
                <Switch
                  id="create-show-home"
                  checked={createForm.showOnHome}
                  onCheckedChange={(checked) =>
                    setCreateForm((prev) => ({ ...prev, showOnHome: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
                <Label htmlFor="create-show-landing">showOnLanding</Label>
                <Switch
                  id="create-show-landing"
                  checked={createForm.showOnLanding}
                  onCheckedChange={(checked) =>
                    setCreateForm((prev) => ({ ...prev, showOnLanding: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
                <Label htmlFor="create-show-all">showOnShowAll</Label>
                <Switch
                  id="create-show-all"
                  checked={createForm.showOnShowAll}
                  onCheckedChange={(checked) =>
                    setCreateForm((prev) => ({ ...prev, showOnShowAll: Boolean(checked) }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeCreateDialog}
              disabled={createSectionMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={submitCreateSection}
              disabled={createSectionMutation.isPending}
            >
              {createSectionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Criar secao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editDialogSection)}
        onOpenChange={(open) => (!open ? closeEditDialog() : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar secao editorial</DialogTitle>
            <DialogDescription>Atualiza metadata e visibilidade da secao.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="edit-section-title">Titulo</Label>
              <Input
                id="edit-section-title"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-section-key">Key</Label>
              <Input
                id="edit-section-key"
                value={editForm.key}
                onChange={(event) => setEditForm((prev) => ({ ...prev, key: event.target.value }))}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select
                value={editForm.sectionType}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    sectionType: value as AdminEditorialSectionType,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Misto</SelectItem>
                  <SelectItem value="content">Conteudo</SelectItem>
                  <SelectItem value="directory">Diretorio</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-section-subtitle">Subtitulo</Label>
              <Input
                id="edit-section-subtitle"
                value={editForm.subtitle}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, subtitle: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-section-order">Ordem</Label>
              <Input
                id="edit-section-order"
                value={editForm.order}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, order: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-section-max-items">Max items</Label>
              <Input
                id="edit-section-max-items"
                value={editForm.maxItems}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, maxItems: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: value as AdminEditorialSectionStatus,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="edit-section-description">Descricao</Label>
              <Textarea
                id="edit-section-description"
                rows={3}
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2 grid gap-2 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
                <Label htmlFor="edit-show-home">showOnHome</Label>
                <Switch
                  id="edit-show-home"
                  checked={editForm.showOnHome}
                  onCheckedChange={(checked) =>
                    setEditForm((prev) => ({ ...prev, showOnHome: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
                <Label htmlFor="edit-show-landing">showOnLanding</Label>
                <Switch
                  id="edit-show-landing"
                  checked={editForm.showOnLanding}
                  onCheckedChange={(checked) =>
                    setEditForm((prev) => ({ ...prev, showOnLanding: Boolean(checked) }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
                <Label htmlFor="edit-show-all">showOnShowAll</Label>
                <Switch
                  id="edit-show-all"
                  checked={editForm.showOnShowAll}
                  onCheckedChange={(checked) =>
                    setEditForm((prev) => ({ ...prev, showOnShowAll: Boolean(checked) }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeEditDialog}
              disabled={updateSectionMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={submitEditSection}
              disabled={updateSectionMutation.isPending}
            >
              {updateSectionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Guardar secao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(addItemSection)}
        onOpenChange={(open) => (!open ? closeAddItemDialog() : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar item editorial</DialogTitle>
            <DialogDescription>
              Secao: {addItemSection?.title ?? '-'} ({addItemSection?.items.length ?? 0}/
              {addItemSection?.maxItems ?? 0})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>targetType</Label>
              <Select
                value={addItemForm.targetType}
                onValueChange={(value) =>
                  setAddItemForm((prev) => ({
                    ...prev,
                    targetType: value as AdminEditorialSectionItemTargetType,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="external_link">Link externo</SelectItem>
                  <SelectItem value="directory_entry">Directory entry</SelectItem>
                  <SelectItem value="article">Artigo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="course">Curso</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="book">Livro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-item-target-id">targetId</Label>
              <Input
                id="add-item-target-id"
                value={addItemForm.targetId}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, targetId: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="add-item-title">titleOverride</Label>
              <Input
                id="add-item-title"
                value={addItemForm.titleOverride}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, titleOverride: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="add-item-badge">badge</Label>
              <Input
                id="add-item-badge"
                value={addItemForm.badge}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, badge: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="add-item-url">urlOverride</Label>
              <Input
                id="add-item-url"
                value={addItemForm.urlOverride}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, urlOverride: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="add-item-image">imageOverride</Label>
              <Input
                id="add-item-image"
                value={addItemForm.imageOverride}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, imageOverride: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="add-item-sort">sortOrder (opcional)</Label>
              <Input
                id="add-item-sort"
                value={addItemForm.sortOrder}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, sortOrder: event.target.value }))
                }
              />
            </div>
            <div>
              <Label>status</Label>
              <Select
                value={addItemForm.status}
                onValueChange={(value) =>
                  setAddItemForm((prev) => ({
                    ...prev,
                    status: value as AdminEditorialSectionItemStatus,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-item-start">startAt (opcional)</Label>
              <Input
                id="add-item-start"
                type="datetime-local"
                value={addItemForm.startAt}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, startAt: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="add-item-end">endAt (opcional)</Label>
              <Input
                id="add-item-end"
                type="datetime-local"
                value={addItemForm.endAt}
                onChange={(event) =>
                  setAddItemForm((prev) => ({ ...prev, endAt: event.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="add-item-description">descriptionOverride</Label>
              <Textarea
                id="add-item-description"
                rows={3}
                value={addItemForm.descriptionOverride}
                onChange={(event) =>
                  setAddItemForm((prev) => ({
                    ...prev,
                    descriptionOverride: event.target.value,
                  }))
                }
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
              <Label htmlFor="add-item-pinned">Pinned</Label>
              <Switch
                id="add-item-pinned"
                checked={addItemForm.isPinned}
                onCheckedChange={(checked) =>
                  setAddItemForm((prev) => ({ ...prev, isPinned: Boolean(checked) }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeAddItemDialog}
              disabled={addItemMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={submitAddItem} disabled={addItemMutation.isPending}>
              {addItemMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Adicionar item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(removeDialogState)}
        onOpenChange={(open) => (!open ? closeRemoveDialog() : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover item editorial</DialogTitle>
            <DialogDescription>
              Esta acao remove o item da secao. Escreve {DOUBLE_CONFIRM_TOKEN} para confirmar.
            </DialogDescription>
          </DialogHeader>
          {removeDialogState ? (
            <div className="space-y-3">
              <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
                <p className="font-medium">{removeDialogState.itemLabel}</p>
                <p className="text-xs text-muted-foreground">
                  sectionId: {removeDialogState.sectionId} | itemId: {removeDialogState.itemId}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remove-item-confirm">Confirmacao dupla</Label>
                <Input
                  id="remove-item-confirm"
                  value={removeConfirmText}
                  onChange={(event) => setRemoveConfirmText(event.target.value)}
                  placeholder={DOUBLE_CONFIRM_TOKEN}
                />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeRemoveDialog}
              disabled={removeItemMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRemoveItem}
              disabled={removeItemMutation.isPending}
            >
              {removeItemMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Remover item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
