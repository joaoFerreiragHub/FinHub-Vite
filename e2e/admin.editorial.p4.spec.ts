import { expect, test, type Page, type Route } from 'playwright/test'

interface SessionOptions {
  userId: string
  name: string
  email: string
  username: string
  role: 'admin' | 'creator'
  adminReadOnly?: boolean
  adminScopes?: string[]
}

interface ClaimState {
  id: string
  targetType: 'directory_entry'
  targetId: string
  status: 'pending' | 'approved'
  reason: string
  note: string | null
  creatorId: {
    id: string
    username: string
    name: string
    email: string
    role: string
  }
  requestedBy: {
    id: string
    username: string
    name: string
    email: string
    role: string
  }
  reviewedBy: {
    id: string
    username: string
    name: string
    email: string
    role: string
  } | null
  reviewedAt: string | null
  reviewNote: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

interface OwnershipTransferState {
  id: string
  targetType: 'directory_entry'
  targetId: string
  fromOwnerType: 'admin_seeded' | 'creator_owned'
  toOwnerType: 'admin_seeded' | 'creator_owned'
  fromOwnerUser: {
    id: string
    username: string
    name: string
    email: string
    role: string
  } | null
  toOwnerUser: {
    id: string
    username: string
    name: string
    email: string
    role: string
  } | null
  transferredBy: {
    id: string
    username: string
    name: string
    email: string
    role: string
  }
  reason: string
  note: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

interface EditorialFlowState {
  claim: ClaimState | null
  transfers: OwnershipTransferState[]
  currentOwnerType: 'admin_seeded' | 'creator_owned'
  currentOwnerUser: {
    id: string
    username: string
    name: string
    email: string
    role: string
  } | null
  transferSequence: number
}

const NOW = new Date().toISOString()
const TARGET_ID = 'dir-e2e-001'
const CLAIM_ID = 'claim-e2e-001'
const CLAIM_REASON = 'Claim ownership via E2E'
const APPROVE_TRANSFER_REASON = 'Claim aprovado via E2E'
const MANUAL_TRANSFER_REASON = 'Ajuste manual ownership via E2E'

const creatorUser = {
  id: 'creator-e2e-1',
  username: 'creator_e2e',
  name: 'Creator E2E',
  email: 'creator@finhub.test',
  role: 'creator',
}

const adminUser = {
  id: 'admin-e2e-1',
  username: 'admin_e2e',
  name: 'Admin E2E',
  email: 'admin@finhub.test',
  role: 'admin',
}

const buildAuthStorage = ({
  userId,
  name,
  email,
  username,
  role,
  adminReadOnly = false,
  adminScopes = [],
}: SessionOptions) =>
  JSON.stringify({
    state: {
      user: {
        id: userId,
        name,
        email,
        username,
        role,
        accountStatus: 'active',
        adminReadOnly,
        adminScopes,
        isEmailVerified: true,
        createdAt: NOW,
        updatedAt: NOW,
      },
      accessToken: 'dev-e2e-access-token',
      refreshToken: 'dev-e2e-refresh-token',
      isAuthenticated: true,
    },
    version: 0,
  })

const setSessionStorage = async (page: Page, options: SessionOptions) => {
  const authStorage = buildAuthStorage(options)
  await page.evaluate(
    ({ storage, role }: { storage: string; role: string }) => {
      localStorage.setItem('auth-storage', storage)
      localStorage.setItem('auth-dev-role', role)
    },
    { storage: authStorage, role: options.role },
  )
}

const fulfillJson = async (route: Route, data: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(data),
  })
}

const normalizePagination = (
  pageParam: string | null,
  limitParam: string | null,
  total: number,
) => {
  const page = Number(pageParam ?? '1')
  const limit = Number(limitParam ?? '25')
  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? limit : 25
  const pages = Math.max(1, Math.ceil(total / normalizedLimit))
  const start = (normalizedPage - 1) * normalizedLimit
  const end = start + normalizedLimit

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    pages,
    slice: { start, end },
  }
}

const installCreatorEditorialApiMocks = async (page: Page, state: EditorialFlowState) => {
  await page.route('**/api/auth/assisted-sessions/**', async (route) => {
    await fulfillJson(route, { items: [], total: 0 })
  })

  await page.route('**/api/editorial/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname, searchParams } = url
    const method = request.method().toUpperCase()

    if (method === 'GET' && pathname.endsWith('/api/editorial/claims/my')) {
      const statusFilter = searchParams.get('status')
      const sourceItems = state.claim ? [state.claim] : []
      const filteredItems =
        statusFilter && statusFilter.length > 0
          ? sourceItems.filter((claim) => claim.status === statusFilter)
          : sourceItems

      const paginationMeta = normalizePagination(
        searchParams.get('page'),
        searchParams.get('limit'),
        filteredItems.length,
      )

      await fulfillJson(route, {
        items: filteredItems.slice(paginationMeta.slice.start, paginationMeta.slice.end),
        pagination: {
          page: paginationMeta.page,
          limit: paginationMeta.limit,
          total: filteredItems.length,
          pages: paginationMeta.pages,
        },
      })
      return
    }

    if (method === 'POST' && pathname.endsWith('/api/editorial/claims')) {
      const payload = request.postDataJSON() as {
        targetType?: string
        targetId?: string
        reason?: string
        note?: string
      }

      const createdAt = new Date().toISOString()
      state.claim = {
        id: CLAIM_ID,
        targetType: 'directory_entry',
        targetId: payload.targetId ?? TARGET_ID,
        status: 'pending',
        reason: payload.reason ?? CLAIM_REASON,
        note: typeof payload.note === 'string' ? payload.note : null,
        creatorId: creatorUser,
        requestedBy: creatorUser,
        reviewedBy: null,
        reviewedAt: null,
        reviewNote: null,
        metadata: null,
        createdAt,
        updatedAt: createdAt,
      }

      await fulfillJson(route, state.claim)
      return
    }

    await fulfillJson(route, { items: [], pagination: { page: 1, limit: 25, total: 0, pages: 1 } })
  })
}

const installAdminEditorialApiMocks = async (page: Page, state: EditorialFlowState) => {
  await page.route('**/api/admin/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname, searchParams } = url
    const method = request.method().toUpperCase()

    if (method === 'GET' && pathname.endsWith('/api/admin/claims')) {
      const statusFilter = searchParams.get('status')
      const targetTypeFilter = searchParams.get('targetType')
      const sourceItems = state.claim ? [state.claim] : []
      const filteredItems = sourceItems.filter((claim) => {
        if (statusFilter && claim.status !== statusFilter) return false
        if (targetTypeFilter && claim.targetType !== targetTypeFilter) return false
        return true
      })

      const paginationMeta = normalizePagination(
        searchParams.get('page'),
        searchParams.get('limit'),
        filteredItems.length,
      )

      await fulfillJson(route, {
        items: filteredItems.slice(paginationMeta.slice.start, paginationMeta.slice.end),
        pagination: {
          page: paginationMeta.page,
          limit: paginationMeta.limit,
          total: filteredItems.length,
          pages: paginationMeta.pages,
        },
      })
      return
    }

    if (method === 'POST' && /\/api\/admin\/claims\/[^/]+\/approve$/.test(pathname)) {
      if (!state.claim) {
        await fulfillJson(route, { message: 'Claim nao encontrado.' })
        return
      }

      const reviewedAt = new Date().toISOString()
      state.claim = {
        ...state.claim,
        status: 'approved',
        reviewedBy: adminUser,
        reviewedAt,
        reviewNote: null,
        updatedAt: reviewedAt,
      }

      state.transferSequence += 1
      const transferLogId = `transfer-log-e2e-${state.transferSequence}`
      const transferAt = new Date().toISOString()

      const transferLog: OwnershipTransferState = {
        id: transferLogId,
        targetType: 'directory_entry',
        targetId: state.claim.targetId,
        fromOwnerType: state.currentOwnerType,
        toOwnerType: 'creator_owned',
        fromOwnerUser: state.currentOwnerUser,
        toOwnerUser: creatorUser,
        transferredBy: adminUser,
        reason: APPROVE_TRANSFER_REASON,
        note: 'Aprovacao de claim E2E',
        metadata: null,
        createdAt: transferAt,
      }

      state.currentOwnerType = 'creator_owned'
      state.currentOwnerUser = creatorUser
      state.transfers = [transferLog, ...state.transfers]

      await fulfillJson(route, {
        claim: state.claim,
        transfer: {
          changed: true,
          targetType: transferLog.targetType,
          targetId: transferLog.targetId,
          fromOwnerType: transferLog.fromOwnerType,
          fromOwnerUserId: transferLog.fromOwnerUser?.id ?? null,
          toOwnerType: transferLog.toOwnerType,
          toOwnerUserId: transferLog.toOwnerUser?.id ?? null,
          transferLogId,
          transferAt,
        },
      })
      return
    }

    if (method === 'POST' && pathname.endsWith('/api/admin/ownership/transfer')) {
      const payload = request.postDataJSON() as {
        targetType?: string
        targetId?: string
        toOwnerType?: 'admin_seeded' | 'creator_owned'
        toOwnerUserId?: string | null
        reason?: string
        note?: string
      }

      const fromOwnerType = state.currentOwnerType
      const fromOwnerUser = state.currentOwnerUser
      const nextOwnerType = payload.toOwnerType ?? 'creator_owned'
      const nextOwnerUser =
        nextOwnerType === 'creator_owned'
          ? {
              id: payload.toOwnerUserId ?? creatorUser.id,
              username: creatorUser.username,
              name: creatorUser.name,
              email: creatorUser.email,
              role: creatorUser.role,
            }
          : null

      state.transferSequence += 1
      const transferLogId = `transfer-log-e2e-${state.transferSequence}`
      const transferAt = new Date().toISOString()

      const transferLog: OwnershipTransferState = {
        id: transferLogId,
        targetType: 'directory_entry',
        targetId: payload.targetId ?? TARGET_ID,
        fromOwnerType,
        toOwnerType: nextOwnerType,
        fromOwnerUser,
        toOwnerUser: nextOwnerUser,
        transferredBy: adminUser,
        reason: payload.reason ?? MANUAL_TRANSFER_REASON,
        note: typeof payload.note === 'string' ? payload.note : null,
        metadata: null,
        createdAt: transferAt,
      }

      const changed =
        fromOwnerType !== nextOwnerType ||
        (fromOwnerUser?.id ?? null) !== (nextOwnerUser?.id ?? null)

      state.currentOwnerType = nextOwnerType
      state.currentOwnerUser = nextOwnerUser
      state.transfers = [transferLog, ...state.transfers]

      await fulfillJson(route, {
        changed,
        targetType: transferLog.targetType,
        targetId: transferLog.targetId,
        fromOwnerType: transferLog.fromOwnerType,
        fromOwnerUserId: transferLog.fromOwnerUser?.id ?? null,
        toOwnerType: transferLog.toOwnerType,
        toOwnerUserId: transferLog.toOwnerUser?.id ?? null,
        transferLogId,
        transferAt,
      })
      return
    }

    if (method === 'GET' && pathname.endsWith('/api/admin/ownership/transfers')) {
      const targetType = searchParams.get('targetType')
      const targetId = searchParams.get('targetId')
      const fromOwnerType = searchParams.get('fromOwnerType')
      const toOwnerType = searchParams.get('toOwnerType')
      const transferredBy = searchParams.get('transferredBy')
      const search = (searchParams.get('search') ?? '').trim().toLowerCase()

      const filteredItems = state.transfers.filter((item) => {
        if (targetType && item.targetType !== targetType) return false
        if (targetId && item.targetId !== targetId) return false
        if (fromOwnerType && item.fromOwnerType !== fromOwnerType) return false
        if (toOwnerType && item.toOwnerType !== toOwnerType) return false
        if (transferredBy && item.transferredBy.id !== transferredBy) return false

        if (search.length > 0) {
          const note = item.note ?? ''
          const haystack = `${item.reason} ${note} ${item.targetId}`.toLowerCase()
          if (!haystack.includes(search)) return false
        }

        return true
      })

      const paginationMeta = normalizePagination(
        searchParams.get('page'),
        searchParams.get('limit'),
        filteredItems.length,
      )

      await fulfillJson(route, {
        items: filteredItems.slice(paginationMeta.slice.start, paginationMeta.slice.end),
        pagination: {
          page: paginationMeta.page,
          limit: paginationMeta.limit,
          total: filteredItems.length,
          pages: paginationMeta.pages,
        },
      })
      return
    }

    await fulfillJson(route, {
      items: [],
      pagination: { page: 1, limit: 25, total: 0, pages: 1 },
    })
  })
}

test.describe('Admin Editorial P4 - E2E claim -> review -> transfer', () => {
  test('creator cria claim, admin aprova e historico mostra transfers', async ({ page }) => {
    const state: EditorialFlowState = {
      claim: null,
      transfers: [],
      currentOwnerType: 'admin_seeded',
      currentOwnerUser: null,
      transferSequence: 0,
    }

    await page.goto('/')
    await setSessionStorage(page, {
      userId: creatorUser.id,
      name: creatorUser.name,
      email: creatorUser.email,
      username: creatorUser.username,
      role: 'creator',
    })
    await installCreatorEditorialApiMocks(page, state)
    await page.reload()

    const createdClaim = await page.evaluate(
      async ({ targetId, reason }) => {
        const response = await fetch('/api/editorial/claims', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetType: 'directory_entry',
            targetId,
            reason,
            note: 'Submissao inicial E2E',
          }),
        })

        const payload = await response.json()
        return {
          status: response.status,
          payload,
        }
      },
      { targetId: TARGET_ID, reason: CLAIM_REASON },
    )

    expect(createdClaim.status).toBe(200)
    expect(createdClaim.payload.status).toBe('pending')

    const creatorClaimsList = await page.evaluate(async () => {
      const response = await fetch('/api/editorial/claims/my?page=1&limit=8')
      return response.json()
    })

    expect(creatorClaimsList.items).toHaveLength(1)
    expect(creatorClaimsList.items[0].reason).toBe(CLAIM_REASON)

    const browserContext = page.context()
    await page.close()

    const adminPage = await browserContext.newPage()
    await installAdminEditorialApiMocks(adminPage, state)
    await adminPage.goto('/')
    await setSessionStorage(adminPage, {
      userId: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      username: adminUser.username,
      role: 'admin',
      adminReadOnly: false,
      adminScopes: ['admin.claim.review', 'admin.claim.transfer'],
    })
    await adminPage.reload()

    await adminPage.goto('/admin/editorial')
    await expect(adminPage.getByText('Claims e ownership')).toBeVisible()
    await expect(adminPage.getByText(CLAIM_REASON)).toBeVisible()

    await adminPage.getByRole('button', { name: 'Aprovar' }).first().click()
    await expect(
      adminPage.getByText('Claim aprovado. Transfer log: transfer-log-e2e-1'),
    ).toBeVisible()
    await expect(adminPage.getByText(APPROVE_TRANSFER_REASON)).toBeVisible()

    await adminPage.fill('#transfer-target-id', TARGET_ID)
    await adminPage.fill('#transfer-owner-user', creatorUser.id)
    await adminPage.fill('#transfer-reason', MANUAL_TRANSFER_REASON)
    await adminPage.fill('#transfer-note', 'Revalidacao operacional E2E')
    await adminPage.getByRole('button', { name: 'Transferir ownership' }).click()

    await expect(
      adminPage.getByText('Ownership transferido. Log: transfer-log-e2e-2'),
    ).toBeVisible()
    await expect(adminPage.getByText(MANUAL_TRANSFER_REASON)).toBeVisible()
    await expect(adminPage.getByText(APPROVE_TRANSFER_REASON)).toBeVisible()

    await adminPage.close()
  })
})
