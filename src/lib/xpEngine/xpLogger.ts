import { XPAction } from "./xpValues"

export async function logXPEvent(userId: string, action: XPAction, xpGained: number) {
  // Aqui podes guardar na base de dados (MongoDB, por exemplo)
  console.log(`[XP LOG] ${userId} ganhou ${xpGained} XP por ${action} em ${new Date().toISOString()}`)

  // Exemplo de estrutura real:
  // await XPLogModel.create({ userId, action, xpGained, timestamp: new Date() })
}
