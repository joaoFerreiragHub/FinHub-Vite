// src/types/comment.ts
export interface CommentType {
  _id: string
  text: string
  userId: { _id: string; name?: string }
  replies: {
    _id: string
    text: string
    userId: { _id: string; name?: string }
  }[]
}
