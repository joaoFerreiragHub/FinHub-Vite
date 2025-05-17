// components/creators/marketing/campanhas/adManager.tsx

import CampaignSummaryCard from "./campaignSummaryCard"
import { ScrollArea } from "../../../ui/scroll-area"

const mockCampaigns = [
  {
    id: "1",
    title: "Promoção de Ebook Financeiro",
    impressions: 1200,
    clicks: 85,
    ctr: 7.1,
    status: "active",
    startDate: "2025-05-01",
    endDate: "2025-05-10",
  },
  {
    id: "2",
    title: "Curso de Investimento",
    impressions: 800,
    clicks: 40,
    ctr: 5.0,
    status: "paused",
    startDate: "2025-04-15",
    endDate: "2025-05-01",
  },
  {
    id: "3",
    title: "Checklist de Poupança",
    impressions: 1500,
    clicks: 75,
    ctr: 5.0,
    status: "pending",
    startDate: "2025-05-11",
  },
  {
    id: "4",
    title: "Webinar: Liberdade Financeira",
    impressions: 600,
    clicks: 18,
    ctr: 3.0,
    status: "rejected",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
  },
]

export default function AdManager() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">As tuas campanhas</h2>
      <ScrollArea className="h-[550px] pr-2">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mockCampaigns.map((campaign) => (
            <CampaignSummaryCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
