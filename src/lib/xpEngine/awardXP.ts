import { xpValues, XPAction } from './xpValues'
import { getLevelFromXP } from './getLevelFromXP'
import { logXPEvent } from './xpLogger'
import {
  getUserById,
  updateUser,
} from '@/features/creators/components/gamification/hooks/mockUserService'
// Estes são mocks que deves substituir pela tua base de dados

export async function awardXP(userId: string, action: XPAction) {
  const xp = xpValues[action]
  if (!xp) return

  const user = await getUserById(userId)
  const prevLevel = user.level
  const totalXP = user.totalXP + xp

  const newLevel = getLevelFromXP(totalXP)

  await updateUser(userId, {
    totalXP,
    currentXP: totalXP, // Se quiseres usar para barra de progresso
    level: newLevel,
  })

  await logXPEvent(userId, action, xp)

  if (newLevel > prevLevel) {
    console.log(`🎉 ${user.name} subiu para o nível ${newLevel}!`)
    // Aqui podes chamar `notifyUserOfNewLevel` ou atualizar UI
  }
}
