import { Zone } from '@entities/zone'

export interface Banner {
  id: number
  title: string
  image: string
  zone: Zone
  restaurant: {
    id: number
    name: string
    zone_id: number
  }
  status: boolean
}
