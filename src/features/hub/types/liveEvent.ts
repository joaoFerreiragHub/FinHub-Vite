export interface LiveEvent {
  id: string
  title: string
  type: "online" | "presencial"
  date: string
  description?: string
  startTime?: string
  endTime?: string
  coverImage?: string
  address?: string
  eventCreatorName?: string
}
