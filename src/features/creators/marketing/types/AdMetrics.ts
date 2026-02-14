// types/AdMetrics.ts
export interface AdMetrics {
  adId: string
  title: string
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  conversionRate: number
  spend: number
  cpc: number
  cpm: number
  revenue?: number
}
