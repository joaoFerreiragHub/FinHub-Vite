// types/CreatorUser.ts

import { User } from "../stores/useUserStore"



export interface CreatorUser extends User {
  totalXP: number
  currentXP: number
  level: number
}
