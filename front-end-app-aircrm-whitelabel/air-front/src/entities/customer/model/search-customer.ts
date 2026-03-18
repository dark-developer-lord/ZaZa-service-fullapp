export interface SearchCustomer {
  id: number
  name: string
  phone: string
  addresses: SearchCustomerAddress[]
  default_address: string
  loyalty_point: number
  loyalty_enabled?: boolean
  loyalty_percentage?: number
  loyalty_point_percentage?: number
  is_first_order?: boolean
}

export interface SearchCustomerAddress {
  id: number
  road: string
  zone_id: number | null
}
