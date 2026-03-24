export interface CommunityLevelMeta {
  level: number
  name: string
  minXp: number
}

export interface CommunityBadgeMeta {
  id: string
  emoji: string
  name: string
  description: string
  unlockHint: string
}

export const COMMUNITY_LEVELS: readonly CommunityLevelMeta[] = [
  { level: 1, name: 'Novato Financeiro', minXp: 0 },
  { level: 2, name: 'Poupador', minXp: 100 },
  { level: 3, name: 'Investidor', minXp: 300 },
  { level: 4, name: 'Estratega', minXp: 700 },
  { level: 5, name: 'Independente', minXp: 1500 },
  { level: 6, name: 'FIRE Walker', minXp: 3000 },
  { level: 7, name: 'Guru Financeiro', minXp: 7000 },
]

export const COMMUNITY_BADGES: readonly CommunityBadgeMeta[] = [
  {
    id: 'primeiros_passos',
    emoji: '🌱',
    name: 'Primeiros Passos',
    description: 'Completar onboarding.',
    unlockHint: 'Conclui o onboarding para desbloquear.',
  },
  {
    id: 'leitor_dedicado',
    emoji: '📚',
    name: 'Leitor Dedicado',
    description: 'Completar 10 artigos.',
    unlockHint: 'Completa 10 artigos do HUB.',
  },
  {
    id: 'estudante',
    emoji: '🎓',
    name: 'Estudante',
    description: 'Completar 1 curso.',
    unlockHint: 'Completa pelo menos 1 curso.',
  },
  {
    id: 'sociavel',
    emoji: '💬',
    name: 'Sociavel',
    description: 'Criar 50 respostas na comunidade.',
    unlockHint: 'Publica 50 respostas.',
  },
  {
    id: 'contribuidor',
    emoji: '⭐',
    name: 'Contribuidor',
    description: 'Receber 10 upvotes.',
    unlockHint: 'Recebe 10 upvotes nas tuas contribuicoes.',
  },
  {
    id: 'em_chama',
    emoji: '🔥',
    name: 'Em Chama',
    description: 'Streak de 7 dias.',
    unlockHint: 'Mantem uma streak diaria de 7 dias.',
  },
  {
    id: 'top_da_semana',
    emoji: '🏆',
    name: 'Top da Semana',
    description: 'Top 3 do leaderboard semanal.',
    unlockHint: 'Fica no top 3 semanal de XP.',
  },
  {
    id: 'premium',
    emoji: '💎',
    name: 'Premium',
    description: 'Assinatura premium ativa.',
    unlockHint: 'Ativa o plano Premium.',
  },
  {
    id: 'fire_master',
    emoji: '👑',
    name: 'FIRE Master',
    description: 'Atingir nivel 7.',
    unlockHint: 'Chega ao nivel 7 da comunidade.',
  },
]

export const getCommunityLevelMeta = (levelRaw?: number): CommunityLevelMeta => {
  const level = Number.isFinite(levelRaw) ? Math.max(1, Math.floor(levelRaw as number)) : 1
  return COMMUNITY_LEVELS.find((entry) => entry.level === level) ?? COMMUNITY_LEVELS[0]
}

export const getCommunityLevelName = (levelRaw?: number): string =>
  getCommunityLevelMeta(levelRaw).name

export const getNextCommunityLevelMeta = (levelRaw?: number): CommunityLevelMeta | null => {
  const currentLevel = getCommunityLevelMeta(levelRaw).level
  return COMMUNITY_LEVELS.find((entry) => entry.level === currentLevel + 1) ?? null
}

export const getCommunityBadgeMeta = (badgeId: string): CommunityBadgeMeta | undefined =>
  COMMUNITY_BADGES.find((badge) => badge.id === badgeId)
