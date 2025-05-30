export type XPAction =
  | "publish_reel"
  | "publish_article"
  | "receive_like"
  | "receive_comment"
  | "reach_100_views"
  | "complete_mission"
  | "content_shared"
  | "daily_login"
  | "positive_rating"

export const xpValues: Record<XPAction, number> = {
  publish_reel: 10,
  publish_article: 12,
  receive_like: 1,
  receive_comment: 2,
  reach_100_views: 5,
  complete_mission: 20,
  content_shared: 5,
  daily_login: 1,
  positive_rating: 15,
}
