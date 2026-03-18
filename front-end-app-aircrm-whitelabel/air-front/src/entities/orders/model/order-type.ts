import { Customer } from '@entities/customer'
import { Store, Warehouse } from '@entities/warehouses'
import { OrderStatusType } from '@shared/lib'

interface OrderWallet {
  id: number
  name: string
  logo: string | null
  amount: number
}

export interface Order {
  id: number
  order_number?: string | number
  customer: Customer
  store: Store
  warehouse: Warehouse,
  total: number
  installment: number
  status: OrderStatusType
  source: string | null
  created_at: string
  wallets?: OrderWallet[]
}
