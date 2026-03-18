import { OrderStatusType } from '@shared/lib'
import { Warehouse } from '../../warehouses'

import { MainRestaurant } from '../../warehouses'

export interface OrderWallet {
  id: number // transaction wallet ID
  vendor_wallet_id: number
  wallet_id: number // actual wallet ID to use for selection
  name: string
  logo: string | null
  amount: number
  status: string
  payment_type: string
  paid_at: string | null
}

export interface OrderShow {
  id: number
  order_number?: string | number
  order_status: OrderStatusType
  customer: OrderCustomer
  store: OrderRestaurant
  warehouse: Warehouse
  delivery_man: OrderDeliveryMan | null
  delivery_address: OrderDeliveryAddress
  products: OrderFood[]
  order_amount: number
  total_discount: number
  details_total_price: number
  main_restaurant: MainRestaurant | null
  zone_id: number
  delivery_charge: number
  created_at: string
  comment_for_restaurant: string | null
  comment: string | null
  installment: string
  is_installment: boolean
  orderInstallment: OrderInstallment | null
  wallets?: OrderWallet[]
  points_used?: string
  points_earned?: string
  points_will_earn?: number
}

export interface OrderFood {
  id: number
  price: number
  variation: string[] | { variation_id: string; variation_type: string } | null
  add_ons: {
    id: number
    name: string
    price: number
    quantity: number
  }[]
  quantity: number
  total_add_on_price: number
  details: OrderFoodDetails
  audit_log?: {
    original_quantity: number
    new_quantity: number
    action: string
    actor_role: string
    logged_at: string
  }
}

export interface OrderFoodDetails {
  id: number
  name: string
  price: number
  image: string
}

export interface OrderDeliveryAddress {
  road: string
}

export interface OrderRestaurant {
  id: number
  name: string
  phone: string
  address: string | null
  logo: string | null
}

export interface OrderCustomer {
  id: number
  f_name: string | null
  l_name: string | null
  phone: string
  avatar: string | null
  loyalty_point?: number
  loyalty_point_percentage?: number
  loyalty_points?: string // API returns this as string
  loyalty_points_percentage?: string // API returns this as string
  has_loyalty_points?: boolean
}

export interface OrderDeliveryMan {
  id: number
  f_name: string | null
  l_name: string | null
  phone: string
  avatar: string | null
}

export interface OrderInstallment {
  id: number
  order_id: number
  order_number: number
  created_at: string
  customer: string
  store: string
  product: OrderFood[]
  due_date: string
  remaining_balance: string
  is_paid: boolean
  initial_payment: string
}
