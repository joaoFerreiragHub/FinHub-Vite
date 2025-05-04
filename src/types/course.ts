export interface Course {
  _id: string
  courseName: string
  description: string
  price: number
  topic: string
  bannerImage?: File | string
  purchaseLink?: string
  status: "draft" | "published"
  hidden?: boolean // <- novo campo
  views: number
}
