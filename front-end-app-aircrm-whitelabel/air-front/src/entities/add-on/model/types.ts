export interface AddOnItem {
  id: number
  name: string
}

export interface AddOn {
  id: number
  name: string
  restaurant: {
    id: number
    name: string
    zone: { id: number; name: string }
  }
  price: number
  status: boolean
}
