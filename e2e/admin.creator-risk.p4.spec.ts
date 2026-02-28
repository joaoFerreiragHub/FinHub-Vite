import { expect, test, type Page, type Route } from 'playwright/test'

const NOW = new Date().toISOString()

const adminActor = {
  id: 'e2e-admin-user-1',
  name: 'E2E Admin',
  username: 'e2e-admin',
  email: 'admin@finhub.test',
  role: 'admin',
}

const buildAuthStorage = () =>
  JSON.stringify({
    state: {
      user: {
        ...adminActor,
        accountStatus: 'active',
        adminReadOnly: false,
        adminScopes: ['admin.users.read', 'admin.users.write', 'admin.content.read'],
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

const installAdminSession = async (page: Page) => {
  const authStorage = buildAuthStorage()
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('auth-storage', value)
  }, authStorage)
}

const fulfillJson = async (route: Route, data: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(data),
  })
}

const buildCreator = (input: {
  id: string
  name: string
  username: string
  email: string
  trustScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendedAction: 'none' | 'review' | 'set_cooldown' | 'block_publishing' | 'suspend_creator_ops'
  openReports: number
  criticalTargets: number
}) => ({
  id: input.id,
  email: input.email,
  name: input.name,
  username: input.username,
  role: 'creator',
  accountStatus: 'active',
  adminReadOnly: false,
  adminScopes: [],
  statusReason: null,
  statusChangedAt: null,
  statusChangedBy: null,
  creatorControls: {
    creationBlocked: false,
    creationBlockedReason: null,
    publishingBlocked: false,
    publishingBlockedReason: null,
    cooldownUntil: null,
    updatedAt: null,
    updatedBy: null,
  },
  trustSignals: {
    trustScore: input.trustScore,
    riskLevel: input.riskLevel,
    recommendedAction: input.recommendedAction,
    generatedAt: NOW,
    summary: {
      openReports: input.openReports,
      highPriorityTargets: input.criticalTargets > 0 ? 1 : 0,
      criticalTargets: input.criticalTargets,
      hiddenItems: 0,
      restrictedItems: 0,
      recentModerationActions30d: 0,
      repeatModerationTargets30d: 0,
      recentCreatorControlActions30d: 0,
      activeControlFlags: [],
    },
    flags: input.criticalTargets > 0 ? ['critical_report_targets'] : [],
    reasons: [
      `${input.openReports} reports abertos em revisao.`,
      input.criticalTargets > 0
        ? `${input.criticalTargets} alvo(s) com reports criticos.`
        : 'Sem alvos criticos.',
    ],
  },
  tokenVersion: 1,
  lastForcedLogoutAt: null,
  lastLoginAt: NOW,
  lastActiveAt: NOW,
  createdAt: NOW,
  updatedAt: NOW,
})

const updateCreatorControls = (
  creator: ReturnType<typeof buildCreator>,
  action: string,
  cooldownHours?: number,
) => {
  if (action === 'set_cooldown') {
    const until = new Date(Date.now() + (cooldownHours || 24) * 60 * 60 * 1000).toISOString()
    creator.creatorControls.cooldownUntil = until
  }
  if (action === 'clear_cooldown') creator.creatorControls.cooldownUntil = null
  if (action === 'block_creation') creator.creatorControls.creationBlocked = true
  if (action === 'unblock_creation') creator.creatorControls.creationBlocked = false
  if (action === 'block_publishing') creator.creatorControls.publishingBlocked = true
  if (action === 'unblock_publishing') creator.creatorControls.publishingBlocked = false
  if (action === 'suspend_creator_ops') {
    creator.creatorControls.creationBlocked = true
    creator.creatorControls.publishingBlocked = true
  }
  if (action === 'restore_creator_ops') {
    creator.creatorControls.creationBlocked = false
    creator.creatorControls.publishingBlocked = false
    creator.creatorControls.cooldownUntil = null
  }

  creator.creatorControls.updatedAt = NOW
  creator.creatorControls.updatedBy = adminActor
  creator.trustSignals.summary.activeControlFlags = [
    ...(creator.creatorControls.creationBlocked ? ['creation_blocked'] : []),
    ...(creator.creatorControls.publishingBlocked ? ['publishing_blocked'] : []),
    ...(creator.creatorControls.cooldownUntil ? ['cooldown_active'] : []),
  ]
}

const buildState = () => ({
  creators: [
    buildCreator({
      id: 'creator-risk-1',
      name: 'Creator Alpha',
      username: 'creator_alpha',
      email: 'alpha@finhub.test',
      trustScore: 32,
      riskLevel: 'high',
      recommendedAction: 'set_cooldown',
      openReports: 4,
      criticalTargets: 1,
    }),
    buildCreator({
      id: 'creator-risk-2',
      name: 'Creator Beta',
      username: 'creator_beta',
      email: 'beta@finhub.test',
      trustScore: 18,
      riskLevel: 'critical',
      recommendedAction: 'suspend_creator_ops',
      openReports: 6,
      criticalTargets: 2,
    }),
  ],
})

const installAdminRiskMocks = async (page: Page, state: ReturnType<typeof buildState>) => {
  await page.route('**/*', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname } = url
    const method = request.method().toUpperCase()

    if (!pathname.startsWith('/api/')) {
      await route.continue()
      return
    }

    if (method === 'GET' && pathname.endsWith('/api/admin/users')) {
      await fulfillJson(route, {
        items: state.creators,
        pagination: { page: 1, limit: 50, total: state.creators.length, pages: 1 },
      })
      return
    }

    if (method === 'GET' && /\/api\/admin\/users\/[^/]+\/trust-profile$/.test(pathname)) {
      const userId = pathname.split('/').slice(-2)[0]
      const creator = state.creators.find((item) => item.id === userId)
      await fulfillJson(route, {
        user: creator,
        trustSignals: creator?.trustSignals ?? null,
      })
      return
    }

    if (method === 'POST' && /\/api\/admin\/users\/[^/]+\/creator-controls$/.test(pathname)) {
      const userId = pathname.split('/').slice(-2)[0]
      const payload = request.postDataJSON() as { action: string; cooldownHours?: number }
      const creator = state.creators.find((item) => item.id === userId)
      if (creator) updateCreatorControls(creator, payload.action, payload.cooldownHours)
      await fulfillJson(route, {
        message: 'Controlos do creator atualizados.',
        action: payload.action,
        creatorControls: creator?.creatorControls ?? null,
        user: creator,
      })
      return
    }

    if (method === 'GET' && pathname.endsWith('/api/admin/content/queue')) {
      const creator = state.creators[0]
      await fulfillJson(route, {
        items: [
          {
            id: 'content-risk-1',
            contentType: 'article',
            title: 'Conteudo de risco moderado',
            slug: 'conteudo-de-risco',
            description: 'Item usado para validar deep-link de criador.',
            category: 'moderation',
            status: 'published',
            moderationStatus: 'visible',
            moderationReason: null,
            moderationNote: null,
            moderatedAt: null,
            moderatedBy: null,
            creator: {
              id: creator.id,
              name: creator.name,
              username: creator.username,
              email: creator.email,
              role: 'creator',
            },
            createdAt: NOW,
            updatedAt: NOW,
            reportSignals: {
              openReports: creator.trustSignals.summary.openReports,
              uniqueReporters: 3,
              priority: 'high',
              priorityScore: 75,
              latestReportAt: NOW,
              topReasons: [{ reason: 'spam', count: 3 }],
            },
            policySignals: {
              recommendedAction: 'review',
              escalationLevel: 'queue_priority',
              automationEligible: false,
              automationBlockedReason: 'recommended_action_not_hide',
            },
            creatorTrustSignals: creator.trustSignals,
          },
        ],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      })
      return
    }

    await fulfillJson(route, {})
  })
}

test.describe('admin creator risk board', () => {
  test('admin aplica cooldown em lote no board de creators', async ({ page }) => {
    const state = buildState()
    await installAdminSession(page)
    await installAdminRiskMocks(page, state)

    await page.goto('/admin/creators')
    await expect(page.getByText('Creators - risco e triagem')).toBeVisible()

    await page.getByLabel('Selecionar creator creator_alpha').click()
    await page.getByLabel('Selecionar creator creator_beta').click()
    await page.getByRole('button', { name: 'Acao em lote' }).click()
    await page.getByRole('button', { name: 'Aplicar a 2' }).click()

    await expect(page.getByText('Cooldown ativo')).toHaveCount(2)
  })

  test('moderacao abre creator board com trust profile em contexto', async ({ page }) => {
    const state = buildState()
    await installAdminSession(page)
    await installAdminRiskMocks(page, state)

    await page.goto('/admin/conteudo')
    await expect(page.getByText('Moderacao de conteudo')).toBeVisible()

    await page.getByRole('link', { name: 'Creator' }).click()

    await expect(page).toHaveURL(/\/admin\/creators\?creatorId=creator-risk-1&view=trust/)
    await expect(page.getByText('Originado na queue de conteudo')).toBeVisible()
    await expect(page.getByText('Trust profile creator')).toBeVisible()
  })
})
