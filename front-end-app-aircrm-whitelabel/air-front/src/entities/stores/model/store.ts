export interface StoreItem {
  id: number
  store_number?: string | number
  name: string
  address: string
  responsible: string
  phone: string
  status: boolean
  vendor: {
    id: string
    f_name: string
  }
}

export interface StoreItemForm {
  id: number
  name: string
  tax: number
  minimum_delivery_time: number
  maximum_delivery_time: number
  address: string
  map_link: string
  latitude: string
  longitude: string
  responsible_name: string
  responsible_phone: string
}