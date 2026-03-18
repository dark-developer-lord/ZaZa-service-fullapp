export interface Counterparty {
  id: number
  counterparty_number?: string | number
  counterparty: string
  name: string
  type: string
  requisite?: string
  address?: string
  phone?: string
  balance: number
  comment: string | null
  status: string
  created_at: string
}

