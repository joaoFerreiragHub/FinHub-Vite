import { AdMetrics } from "../types/AdMetrics";

// mock/mockAdMetrics.ts
export const mockAdMetrics: AdMetrics[] = [
  {
    adId: "ad1",
    title: "Promoção Ebook Finanças",
    impressions: 3500,
    clicks: 210,
    ctr: 6,
    conversions: 42,
    conversionRate: 20,
    spend: 52.5,
    cpc: 0.25,
    cpm: 15,
    revenue: 126,
  },
  {
    adId: "ad2",
    title: "Curso Investimento 101",
    impressions: 8000,
    clicks: 400,
    ctr: 5,
    conversions: 80,
    conversionRate: 20,
    spend: 200,
    cpc: 0.50,
    cpm: 25,
    revenue: 500,
  },
]
