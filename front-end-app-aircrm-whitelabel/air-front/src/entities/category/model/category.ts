export interface Category {
  id: number
  name: string
}

export interface CategoryItem {
  id: number
  name: string
  image: string
  status: boolean
  priority: number
  parent_id: number
  position: number
  store: string
  store_id: number
}
