export interface LastOrderType {
  id: number
  created_at: string
  order_amount: number
  customer: {
    id: number
    avatar?: string
    name: string
    phone: string
  }
}
