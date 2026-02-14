import { WalletTransaction } from "../types/WalletTransaction";

export const mockTransactions: WalletTransaction[] = [
  {
    type: "load",
    amount: 30,
    date: "2025-05-10",
    status: "Concluído",
    method: "card",
  },
  {
    type: "spend",
    amount: -10,
    date: "2025-05-08",
    status: "Usado em anúncio de produto",
    context: "ad_product",
  },
  {
    type: "load",
    amount: 50,
    date: "2025-05-05",
    status: "Concluído",
    method: "paypal",
  },
  {
    type: "spend",
    amount: -5,
    date: "2025-05-03",
    status: "Impulsionamento de perfil",
    context: "ad_profile",
  },
]
