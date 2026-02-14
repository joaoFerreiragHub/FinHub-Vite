type TransactionType = "load" | "spend"
type PaymentMethod = "card" | "paypal" | "coupon"
type SpendContext = "ad_product" | "ad_profile" | "boost"

export interface WalletTransaction {
  type: TransactionType
  amount: number
  date: string
  status: string
  method?: PaymentMethod      // só em "load"
  context?: SpendContext      // só em "spend"
}
