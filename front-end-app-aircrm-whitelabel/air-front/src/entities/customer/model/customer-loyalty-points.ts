export interface CustomerLoyaltyPoint {
  id: number
  date: string
  balance: number
  conditions: string
  transaction_type: string
  deducted: number
  points_used: number
  credited: number
  accrual: number
  remaining: number
  action: string
}

export interface CustomerLoyaltyInfo {
  id: number
  f_name: string
  l_name: string | null
  phone: string
  loyalty_points: CustomerLoyaltyPoint[]
}
