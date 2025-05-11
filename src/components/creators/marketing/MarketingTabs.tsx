import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import InsightsDashboard from "./insights/InsightsDashboard";
import WalletDashboardPage from "./wallet/WalletDashboard";

export default function MarketingTabs() {
  return (
    <Tabs defaultValue="wallet" className="space-y-8">
      <TabsList>
        <TabsTrigger value="wallet">Wallet</TabsTrigger>
        <TabsTrigger value="insights">Insights de Anúncios</TabsTrigger>
      </TabsList>

      <TabsContent value="wallet">
        <WalletDashboardPage />
      </TabsContent>

      <TabsContent value="insights">
        <InsightsDashboard />
      </TabsContent>
    </Tabs>
  )
}
