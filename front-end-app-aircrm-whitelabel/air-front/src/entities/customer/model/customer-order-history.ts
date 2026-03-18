export interface CustomerOrderProduct {
  id: number
  name: string
  image: string
  quantity: number
}

export interface CustomerOrderHistory {
  id: number
  order_number?: string | number
  date: string
  order_amount: number
  order_quantity: number
  products: CustomerOrderProduct[]
  discount: number
  points: number
}

export interface CustomerGeneralInfo {
  id: number
  f_name: string
  l_name: string | null
  phone: string
  orders: CustomerOrderHistory[]
}
