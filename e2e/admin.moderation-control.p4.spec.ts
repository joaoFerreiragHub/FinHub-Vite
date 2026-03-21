import { expect, test, type Page, type Route } from 'playwright/test'

const NOW = new Date().toISOString()

const adminActor = {
  id: 'e2e-admin-user-1',
  name: 'E2E Admin',
  username: 'e2e-admin',
  email: 'admin@finhub.test',
  role: 'admin',
}

const defaultWorkerStatus = {
  generatedAt: NOW,
  worker: {
    key: 'admin_content_jobs',
    status: 'idle',
    workerId: 'admin-content-jobs:e2e:123:abcd1234',
    processId: 1234,
    host: 'e2e-host',
    startedAt: NOW,
    stoppedAt: null,
    lastHeartbeatAt: NOW,
    currentJobId: null,
    currentJobType: null,
    currentJobStartedAt: null,
    lastJobFinishedAt: NOW,
    stats: {
      claimedJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      requeuedJobs: 0,
    },
    lastError: null,
    lastErrorAt: null,
  },
  queue: {
    queued: 0,
    scheduled: 0,
    nextScheduledAt: null,
    awaitingApproval: 0,
    running: 0,
    staleRunning: 0,
    retrying: 0,
    maxAttemptsReached: 0,
    failedLast24h: 0,
  },
  currentJob: null,
  config: {
    leaseMs: 60000,
    heartbeatMs: 5000,
    staleAfterMs: 60000,
    maxAttempts: 3,
  },
}

const buildAuthStorage = (adminScopes: string[]) =>
  JSON.stringify({
    state: {
      user: {
        ...adminActor,
        accountStatus: 'active',
        adminReadOnly: false,
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

const installAdminSession = async (page: Page, adminScopes: string[]) => {
  const authStorage = buildAuthStorage(adminScopes)
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('auth-storage', value)
    window.localStorage.setItem('auth-dev-role', 'admin')
  }, authStorage)
}

const fulfillJson = async (route: Route, data: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  })
}

const buildQueueItem = (
  id: string,
  input?: {
    title?: string
    moderationStatus?: 'visible' | 'hidden' | 'restricted'
    openReports?: number
    priority?: 'none' | 'low' | 'medium' | 'high' | 'critical'
  },
) => ({
  id,
  contentType: 'article',
  title: input?.title ?? `Conteudo ${id}`,
  slug: `conteudo-${id}`,
  description: 'Item E2E para moderacao.',
  category: 'moderation',
  status: 'published',
  moderationStatus: input?.moderationStatus ?? 'visible',
  moderationReason: input?.moderationStatus === 'hidden' ? 'Ocultacao previa.' : null,
  moderationNote: null,
  moderatedAt: input?.moderationStatus === 'hidden' ? NOW : null,
  moderatedBy: input?.moderationStatus === 'hidden' ? adminActor : null,
  creator: {
    id: 'creator-e2e-1',
    name: 'Creator E2E',
    username: 'creator_e2e',
    email: 'creator@finhub.test',
    role: 'creator',
  },
  createdAt: NOW,
  updatedAt: NOW,
  reportSignals: {
    openReports: input?.openReports ?? 0,
    uniqueReporters: input?.openReports ? 2 : 0,
    latestReportAt: input?.openReports ? NOW : null,
    topReasons: input?.openReports ? [{ reason: 'spam', count: input.openReports }] : [],
    priorityScore: input?.openReports ? 70 : 0,
    priority: input?.priority ?? 'none',
  },
  automatedSignals: {
    active: false,
    severity: 'none',
    confidence: 0,
    source: 'none',
    reasons: [],
    triggeredRules: [],
    recommendedAction: 'none',
    blockedByTrust: false,
    blockedReason: null,
    triggeredAt: null,
    lastDetectedAt: null,
    automation: {
      eligible: false,
      enabled: false,
      executed: false,
      blockedReason: null,
      lastAttemptAt: null,
      actorId: null,
      action: null,
      eventId: null,
      retries: 0,
      source: null,
      triggerSource: null,
      triggerSignalId: null,
      triggerSeverity: null,
    },
    triggerSource: null,
    triggerSignalId: null,
  },
  policySignals: {
    recommendedAction: input?.openReports ? 'review' : 'none',
    escalation: input?.openReports ? 'medium' : 'none',
    automationEligible: false,
    automationEnabled: false,
    automationBlockedReason: null,
    matchedReasons: input?.openReports ? ['spam'] : [],
    profile: {
      key: 'multi_surface_discovery',
      label: 'Policy profile',
      primarySurface: 'editorial_home',
      surfaces: ['editorial_home'],
    },
    thresholds: {
      reviewMinPriority: 'low',
      restrictMinPriority: 'medium',
      highPriorityHideMinUniqueReporters: 3,
      highRiskHideMinUniqueReporters: 2,
      autoHideMinPriority: 'critical',
      autoHideMinUniqueReporters: 3,
      autoHideAllowedReasons: ['scam', 'hate', 'sexual', 'violence'],
    },
  },
  creatorTrustSignals: null,
})

const buildPagination = (total: number, limit = 20) => ({
  page: 1,
  limit,
  total,
  pages: Math.max(1, Math.ceil(total / limit)),
})

test.describe('admin moderation control p4', () => {
  test('admin executa fast hide e confirma badge no historico', async ({ page }) => {
    let fastHidden = false
    const contentId = 'content-fast-1'

    await installAdminSession(page, ['admin.content.read', 'admin.content.moderate'])

    await page.route('**/api/admin/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const { pathname } = url
      const method = request.method().toUpperCase()

      if (method === 'GET' && pathname.endsWith('/api/admin/content/queue')) {
        const item = buildQueueItem(contentId, {
          title: 'Conteudo para fast hide',
          moderationStatus: fastHidden ? 'hidden' : 'visible',
          openReports: 3,
          priority: 'high',
        })
        await fulfillJson(route, {
          items: [item],
          pagination: buildPagination(1),
        })
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs/worker-status')) {
        await fulfillJson(route, defaultWorkerStatus)
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs')) {
        await fulfillJson(route, {
          items: [],
          pagination: buildPagination(0, 6),
        })
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/moderation-templates')) {
        await fulfillJson(route, {
          items: [],
          pagination: buildPagination(0, 100),
        })
        return
      }

      if (method === 'POST' && pathname.endsWith(`/api/admin/content/article/${contentId}/hide`)) {
        const payload = request.postDataJSON() as { reason?: string }
        expect(typeof payload.reason).toBe('string')
        expect(payload.reason?.trim().length).toBeGreaterThan(0)

        fastHidden = true
        await fulfillJson(route, {
          message: 'Conteudo ocultado em modo rapido com sucesso.',
          changed: true,
          fromStatus: 'visible',
          toStatus: 'hidden',
          content: buildQueueItem(contentId, {
            title: 'Conteudo para fast hide',
            moderationStatus: 'hidden',
            openReports: 3,
            priority: 'high',
          }),
        })
        return
      }

      if (
        method === 'GET' &&
        pathname.endsWith(`/api/admin/content/article/${contentId}/history`)
      ) {
        const items = fastHidden
          ? [
              {
                id: 'evt-fast-hide-1',
                contentType: 'article',
                contentId,
                actor: adminActor,
                action: 'hide',
                fromStatus: 'visible',
                toStatus: 'hidden',
                reason: 'Ocultacao rapida preventiva para protecao da plataforma.',
                note: 'Fast hide E2E.',
                metadata: { fastTrack: true },
                createdAt: NOW,
              },
            ]
          : []

        await fulfillJson(route, {
          items,
          pagination: buildPagination(items.length, 10),
        })
        return
      }

      await fulfillJson(route, {
        items: [],
        pagination: buildPagination(0),
      })
    })

    await page.goto('/admin/conteudo')
    await expect(page.getByText('Moderacao de conteudo')).toBeVisible()

    await page.getByRole('button', { name: 'Ocultar' }).first().click()
    await expect(page.getByRole('heading', { name: 'Ocultar conteudo' })).toBeVisible()
    await page.fill('#admin-content-action-confirm', 'CONFIRMAR')
    await page.getByRole('button', { name: 'Confirmar ocultacao' }).click()

    await expect(page.getByText('Conteudo ocultado em modo rapido com sucesso.')).toBeVisible()

    await page.getByRole('button', { name: 'Historico' }).first().click()
    const historyDialog = page.getByRole('dialog')
    await expect(historyDialog.getByText('Fast hide', { exact: true })).toBeVisible()
  })

  test('admin tenta criar lote com guardrail de limite de itens', async ({ page }) => {
    const items = Array.from({ length: 11 }, (_, index) =>
      buildQueueItem(`content-bulk-${index + 1}`, {
        title: `Conteudo lote ${index + 1}`,
        moderationStatus: 'visible',
      }),
    )
    let bulkEndpointCalled = false

    await installAdminSession(page, ['admin.content.read', 'admin.content.moderate'])

    await page.route('**/api/admin/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const { pathname } = url
      const method = request.method().toUpperCase()

      if (method === 'GET' && pathname.endsWith('/api/admin/content/queue')) {
        await fulfillJson(route, {
          items,
          pagination: buildPagination(items.length),
        })
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs/worker-status')) {
        await fulfillJson(route, defaultWorkerStatus)
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs')) {
        await fulfillJson(route, {
          items: [],
          pagination: buildPagination(0, 6),
        })
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/moderation-templates')) {
        await fulfillJson(route, {
          items: [],
          pagination: buildPagination(0, 100),
        })
        return
      }

      if (method === 'POST' && pathname.endsWith('/api/admin/content/bulk-moderate/jobs')) {
        const payload = request.postDataJSON() as {
          action?: string
          confirm?: boolean
          items?: Array<{ contentType: string; contentId: string }>
        }

        bulkEndpointCalled = true
        expect(payload.action).toBe('hide')
        expect(payload.confirm).toBe(true)
        expect(Array.isArray(payload.items)).toBe(true)
        expect(payload.items?.length).toBe(11)

        await fulfillJson(
          route,
          {
            error: 'Guardrail: lote acima do limite operacional permitido para esta execucao.',
          },
          400,
        )
        return
      }

      await fulfillJson(route, {
        items: [],
        pagination: buildPagination(0),
      })
    })

    await page.goto('/admin/conteudo')
    await expect(page.getByText('Moderacao de conteudo')).toBeVisible()

    await page.getByRole('button', { name: /Selecionar p.gina/i }).click()
    await page.getByRole('button', { name: 'Criar job' }).first().click()

    const bulkDialog = page.getByRole('dialog')
    await expect(bulkDialog.getByRole('heading', { name: /Criar job/i })).toBeVisible()

    const submitButton = bulkDialog.getByRole('button', { name: 'Criar job' })
    await expect(submitButton).toBeDisabled()
    await bulkDialog.locator('#admin-content-bulk-confirm').fill('CONFIRMAR')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    await expect(
      page.getByText('Guardrail: lote acima do limite operacional permitido para esta execucao.'),
    ).toBeVisible()
    expect(bulkEndpointCalled).toBeTruthy()
  })

  test('admin aplica creator control e valida estado atualizado', async ({ page }) => {
    let creatorControlApplied = false
    const usersState = [
      {
        id: 'creator-risk-1',
        email: 'alpha@finhub.test',
        name: 'Creator Alpha',
        username: 'creator_alpha',
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
          trustScore: 34,
          riskLevel: 'high',
          recommendedAction: 'set_cooldown',
          generatedAt: NOW,
          summary: {
            openReports: 4,
            highPriorityTargets: 1,
            criticalTargets: 1,
            hiddenItems: 0,
            restrictedItems: 0,
            recentModerationActions30d: 0,
            repeatModerationTargets30d: 0,
            recentCreatorControlActions30d: 0,
            activeControlFlags: [],
          },
          flags: ['critical_report_targets'],
          reasons: ['4 reports em aberto.'],
        },
        tokenVersion: 1,
        lastForcedLogoutAt: null,
        lastLoginAt: NOW,
        lastActiveAt: NOW,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: 'free-user-1',
        email: 'free@finhub.test',
        name: 'Free User',
        username: 'free_user',
        role: 'free',
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
          trustScore: 70,
          riskLevel: 'low',
          recommendedAction: 'none',
          generatedAt: NOW,
          summary: {
            openReports: 0,
            highPriorityTargets: 0,
            criticalTargets: 0,
            hiddenItems: 0,
            restrictedItems: 0,
            recentModerationActions30d: 0,
            repeatModerationTargets30d: 0,
            recentCreatorControlActions30d: 0,
            activeControlFlags: [],
          },
          flags: [],
          reasons: ['Sem sinais de risco relevantes.'],
        },
        tokenVersion: 1,
        lastForcedLogoutAt: null,
        lastLoginAt: NOW,
        lastActiveAt: NOW,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ]

    await installAdminSession(page, ['admin.users.read', 'admin.users.write', 'admin.content.read'])

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
          items: usersState,
          pagination: buildPagination(usersState.length, 20),
        })
        return
      }

      if (method === 'GET' && /\/api\/admin\/users\/[^/]+\/trust-profile$/.test(pathname)) {
        const userId = pathname.split('/').slice(-2)[0]
        const creator = usersState.find((item) => item.id === userId) ?? null
        await fulfillJson(route, {
          user: creator,
          trustSignals: creator?.trustSignals ?? null,
        })
        return
      }

      if (method === 'POST' && /\/api\/admin\/users\/[^/]+\/creator-controls$/.test(pathname)) {
        const userId = pathname.split('/').slice(-2)[0]
        const payload = request.postDataJSON() as { action: string; cooldownHours?: number }
        const creator = usersState.find((item) => item.id === userId)

        if (creator && payload.action === 'set_cooldown') {
          const cooldownHours = Math.max(Number(payload.cooldownHours || 24), 1)
          creator.creatorControls.cooldownUntil = new Date(
            Date.now() + cooldownHours * 60 * 60 * 1000,
          ).toISOString()
          creator.creatorControls.updatedAt = NOW
          creator.creatorControls.updatedBy = adminActor
          creator.trustSignals.summary.activeControlFlags = ['cooldown_active']
          creatorControlApplied = true
        }

        await fulfillJson(route, {
          message: 'Controlos do creator atualizados.',
          action: payload.action,
          creatorControls: creator?.creatorControls ?? null,
          user: creator ?? null,
        })
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/content/queue')) {
        await fulfillJson(route, {
          items: [],
          pagination: buildPagination(0),
        })
        return
      }

      await fulfillJson(route, {})
    })

    await page.goto('/admin/users')
    await expect(page.getByText('Gestao de utilizadores')).toBeVisible()

    await page.getByRole('button', { name: 'Controlo creator' }).first().click()
    const creatorDialog = page.getByRole('dialog')
    await expect(
      creatorDialog.getByRole('heading', { name: /Controlos do creator/i }),
    ).toBeVisible()
    await creatorDialog.getByRole('button', { name: 'Aplicar controlo' }).click()

    await expect(page.getByText('Controlos do creator atualizados.')).toBeVisible()
    expect(creatorControlApplied).toBeTruthy()
  })

  test('admin executa rollback assistido a partir do historico de moderacao', async ({ page }) => {
    const contentId = 'content-rollback-1'
    let rollbackApplied = false

    await installAdminSession(page, ['admin.content.read', 'admin.content.moderate'])

    await page.route('**/api/admin/**', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const { pathname, searchParams } = url
      const method = request.method().toUpperCase()

      if (method === 'GET' && pathname.endsWith('/api/admin/content/queue')) {
        await fulfillJson(route, {
          items: [
            buildQueueItem(contentId, {
              title: 'Conteudo para rollback',
              moderationStatus: rollbackApplied ? 'visible' : 'hidden',
              openReports: 2,
              priority: 'medium',
            }),
          ],
          pagination: buildPagination(1),
        })
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs/worker-status')) {
        await fulfillJson(route, defaultWorkerStatus)
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/content/jobs')) {
        await fulfillJson(route, {
          items: [],
          pagination: buildPagination(0, 6),
        })
        return
      }

      if (method === 'GET' && pathname.endsWith('/api/admin/moderation-templates')) {
        await fulfillJson(route, {
          items: [],
          pagination: buildPagination(0, 100),
        })
        return
      }

      if (
        method === 'GET' &&
        pathname.endsWith(`/api/admin/content/article/${contentId}/history`)
      ) {
        await fulfillJson(route, {
          items: [
            {
              id: 'evt-hide-rollback-1',
              contentType: 'article',
              contentId,
              actor: adminActor,
              action: 'hide',
              fromStatus: 'visible',
              toStatus: 'hidden',
              reason: 'Ocultacao para triagem.',
              note: 'E2E rollback.',
              metadata: { rollback: true },
              createdAt: NOW,
            },
          ],
          pagination: buildPagination(1, 10),
        })
        return
      }

      if (
        method === 'GET' &&
        pathname.endsWith(`/api/admin/content/article/${contentId}/rollback-review`)
      ) {
        expect(searchParams.get('eventId')).toBe('evt-hide-rollback-1')

        await fulfillJson(route, {
          content: buildQueueItem(contentId, {
            title: 'Conteudo para rollback',
            moderationStatus: 'hidden',
            openReports: 2,
            priority: 'medium',
          }),
          event: {
            id: 'evt-hide-rollback-1',
            contentType: 'article',
            contentId,
            actor: adminActor,
            action: 'hide',
            fromStatus: 'visible',
            toStatus: 'hidden',
            reason: 'Ocultacao para triagem.',
            note: 'E2E rollback.',
            metadata: { rollback: true },
            createdAt: NOW,
          },
          rollback: {
            action: 'unhide',
            targetStatus: 'visible',
            currentStatus: 'hidden',
            canRollback: true,
            requiresConfirm: false,
            falsePositiveEligible: true,
            warnings: [],
            blockers: [],
            guidance: ['Validar contexto antes de reativar o conteudo.'],
            checks: {
              isLatestEvent: true,
              newerEventsCount: 0,
              currentMatchesEventToStatus: true,
              openReports: 2,
              uniqueReporters: 2,
              automatedSignalActive: false,
              automatedSeverity: 'none',
              creatorRiskLevel: 'low',
            },
          },
        })
        return
      }

      if (
        method === 'POST' &&
        pathname.endsWith(`/api/admin/content/article/${contentId}/rollback`)
      ) {
        const payload = request.postDataJSON() as {
          eventId?: string
          reason?: string
        }

        expect(payload.eventId).toBe('evt-hide-rollback-1')
        expect(typeof payload.reason).toBe('string')
        expect(payload.reason?.trim().length).toBeGreaterThan(0)

        rollbackApplied = true

        await fulfillJson(route, {
          message: 'Rollback assistido concluido com sucesso.',
          changed: true,
          fromStatus: 'hidden',
          toStatus: 'visible',
          content: buildQueueItem(contentId, {
            title: 'Conteudo para rollback',
            moderationStatus: 'visible',
            openReports: 0,
            priority: 'none',
          }),
          rollback: {
            eventId: 'evt-hide-rollback-1',
            action: 'unhide',
            targetStatus: 'visible',
            requiresConfirm: false,
            warnings: [],
            falsePositiveRecorded: false,
          },
        })
        return
      }

      await fulfillJson(route, {
        items: [],
        pagination: buildPagination(0),
      })
    })

    await page.goto('/admin/conteudo')
    await expect(page.getByText('Moderacao de conteudo')).toBeVisible()

    await page.getByRole('button', { name: 'Historico' }).first().click()
    await page.getByRole('button', { name: 'Rever rollback' }).first().click()

    const rollbackDialog = page.getByRole('dialog')
    await expect(rollbackDialog.getByRole('heading', { name: /Rollback assistido/i })).toBeVisible()
    const rollbackButton = rollbackDialog.getByRole('button', {
      name: 'Executar rollback assistido',
    })
    await rollbackButton.evaluate((node: HTMLElement) => node.click())

    await expect(page.getByText('Rollback assistido concluido com sucesso.')).toBeVisible()
  })
})
