import { CreatorUser } from '@/lib/CreatorUser'

const mockDB = new Map<string, CreatorUser>()

export async function getUserById(userId: string): Promise<CreatorUser> {
  if (!mockDB.has(userId)) {
    mockDB.set(userId, {
      id: userId,
      name: `Utilizador ${userId}`,
      email: `${userId}@fake.com`,
      username: userId,
      accessToken: 'mock-token',
      role: 'creator',
      totalXP: 0,
      currentXP: 0,
      level: 1,
    })
  }
  return mockDB.get(userId)!
}

export async function updateUser(userId: string, updates: Partial<CreatorUser>): Promise<void> {
  const user = await getUserById(userId)
  const updated = { ...user, ...updates }
  mockDB.set(userId, updated)
}
