export interface Courier {
  id: number
  f_name: string
  l_name: string
  zone: {
    id: number
    name: string
  }
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
