// types/CreatorUser.ts

import { User } from '@/features/auth/types'

export interface CreatorUser extends User {
  totalXP: number
  currentXP: number
  level: number
}
