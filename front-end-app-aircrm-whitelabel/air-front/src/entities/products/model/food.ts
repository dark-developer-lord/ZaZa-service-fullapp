export interface Food {
  id: number
  name?: string
  product_name?: string
  price?: number
  retail_price?: number
  image: string | null
  quantity?: number | string
  variations?: FoodVariation[] | ProductVariation[] // Support both old and new structure
  choice_options?: FoodChoiceOption[]
  add_ons?: FoodAddon[]
  restaurant_id?: number
  discount?: number
  variation_name?: string | null // New field for variation name (e.g., "Size", "Color")
}

export interface FoodEdit {
  id: number
  name: string
  price: number
  image: string
  description: string
  variations: FoodVariation[]
  choice_options: FoodChoiceOption[]
  add_ons: FoodAddon[]
  discount: number
  discount_type: 'percent' | 'fixed'
  available_time_starts: string
  available_time_ends: string
  category_ids: { id: string; position: number }[]
  veg: number
  restaurant_id: number
}

// Old variation structure (for backward compatibility)
export interface FoodVariation {
  type: string
  price: number
}

// New variation structure from warehouse API
export interface ProductVariation {
  id: number
  variation_id: string
  variation_type: string
  attribute_id: number
  attribute_value: string
  cost_price: number
  sale_price: number
  quantity: number
  barcode: string | null
}

export interface FoodChoiceOption {
  name: string
  title: string
  options: string[]
}

export interface FoodAddon {
  id: number
  name: string
  price: number
}

export interface FoodItem {
  id: number
  name: string
  price: number
  image: string
  status: boolean,
  warehouse: {
    name: string,
  }
  warehouse_quantity: number,
  category: {
    id: number
    name: string
    sub_categories: { id: number; name: string }[]
  }
}

export interface ProductArrivalItem {
  id: number,
  name: string,
  status: string,
  date: string,
  warehouse: string,
  company_name: string,
  total_price: number
}

export interface ProductSalesItem {
  id: number,
  name: string,
  deal_id: number,
  order_number?: string | number,
  status: string,
  date: string,
  warehouse: string,
  client: string,
  quantity: number,
  sum: number,
}

export interface ProductFlowItem {
  id: number,
  name: string,
  status: string,
  date: string,
  warehouseFrom: string,
  warehouseIn: string,
  quantity: number,
  sum: number,
}

export interface ProductWriteOffItem {
  id: number,
  name: string,
  status: string,
  date: string,
  warehouse: string,
  quantity: number,
  sum: number,
}



