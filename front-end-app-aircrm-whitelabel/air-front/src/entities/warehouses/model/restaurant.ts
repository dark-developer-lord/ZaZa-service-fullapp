import { Zone } from '@entities/zone'

export interface Store {
  id: number
  name: string
  slug: string
  address: Zone
}

export interface Warehouse {
  id: number,
  name: string,
  phone: string,
  responsible: null | string,
  status: boolean
}

export interface WarehouseShow {
  id: number,
  name: string,
  address: string,
  responsible: string,
  phone: string,
  owner: {
    name: string,
    phone: string,
    email: string,
  }
}

export interface WarehouseItem extends Warehouse {
  address: string,
}

export interface Restaurant {
  id: number
  name: string
  address: string
  slug: string
}

export interface RestaurantSelect {
  id: number
  name: string
  slug: string
  logo: string
  zone: Zone
}

export interface MainRestaurant extends RestaurantSelect {
  available_zones: RestaurantAvailableZone[]
}

export interface RestaurantAvailableZone {
  restaurant_id: number
  zone: Zone
}

export interface RestaurantItem {
  id: number
  name: string
  phone: string
  logo: string
  banner: string
  zone: {
    id: number
    name: string
  }
  status: boolean
  vendor: string
}

export interface RestaurantShow {
  id: number
  name: string
  phone: string
  logo: string
  banner: string
  address: string
  map_link: string
  latitude: number
  longitude: number
  delivery_time: string
  zone: Zone
  tax: number
  status: boolean
  main_restaurant: {
    id: number
    name: string
  } | null
  vendor: {
    id: number
    f_name: string
    l_name: string
    email: string
    phone: string
  }
}

export interface Source {
  stores: {
    id: number,
    name: string
  },
  warehouses: {
    id: number,
    name: string
  }
}