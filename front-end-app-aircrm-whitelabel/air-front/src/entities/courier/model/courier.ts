export interface Courier {
  id: number
  delivery_man_number?: string | number
  f_name: string
  l_name: string
  avatar: string
  status: boolean
  phone: string
}

export interface CourierShow extends Courier {
  earning: number
  email: string
  identity_number: string
  identity_type: string
}
