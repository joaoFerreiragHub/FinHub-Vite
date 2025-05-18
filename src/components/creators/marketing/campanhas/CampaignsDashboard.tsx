// components/creators/marketing/campanhas/CampaignsDashboard.tsx

import AdManager from "./adManager"
import AdCreationWizard from "./adCreationWizard"
import EmptyCampaignState from "./emptyCampaignState"
import CampaignInsightsCard from "./campaignInsightsCard"
import PromoPreviewCard from "./promoPreviewCard"
import PromoQuickUpload from "./promoQuickUpload"

export default function CampaignsDashboard() {
  const hasCampaigns = true // mock: substitui futuramente com dados reais

  return (
    <div className="space-y-8">
      {/* Criação de campanha */}
      <AdCreationWizard />

      {/* Resumo de campanhas ou estado vazio */}
      {hasCampaigns ? (
        <AdManager />
      ) : (
        <EmptyCampaignState />
      )}

      {/* Campanha em destaque / desempenho */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampaignInsightsCard
          title="Curso de Investimento"
          impressions={1200}
          clicks={240}
          conversions={32}
          spend={96}
        />
        <CampaignInsightsCard
          title="Checklist de Finanças"
          impressions={890}
          clicks={102}
          conversions={14}
          spend={74}
        />
      </div>

      {/* Promoções em destaque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PromoPreviewCard
          imageUrl="https://via.placeholder.com/400x200"
          title="Promoção de Ebook"
          ctaText="Editar"
          status="ativo"
        />
        <PromoPreviewCard
          imageUrl="https://via.placeholder.com/400x200"
          title="Webinar Gratuito"
          ctaText="Editar"
          status="rascunho"
        />
      </div>

      {/* Upload rápido de promo */}
      <PromoQuickUpload />
    </div>
  )
}
