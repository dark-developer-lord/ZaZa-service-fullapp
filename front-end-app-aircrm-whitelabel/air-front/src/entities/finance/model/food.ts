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
  barcode: string
}

export interface Food {
  id: number
  name?: string
  product_name?: string
  price?: number
  retail_price?: number
  image: string | null
  quantity: number | string
  variations?: FoodVariation[] | ProductVariation[]
  choice_options?: FoodChoiceOption[]
  add_ons?: FoodAddon[]
  discount?: number
}

export interface FoodEdit {
  id: number
  name: string
  purchase_price: number
  price: number
  quantity: number
  product_code: string
  image: string
  description: string
  variations: ProductVariation[] | FoodVariation[] // Support both old and new structure
  choice_options?: FoodChoiceOption[] | null
  add_ons: FoodAddon[]
  discount: number
  discount_type: 'percent' | 'amount'
  available_time_starts: string
  available_time_ends: string
  category_ids?: { id: string | number; position: number }[] | null
  variation_name?: string
  product_variations?: ProductVariation[]
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
  quantity: number,
  category: {
    id: number
    name: string
    sub_categories: { id: number; name: string }[]
  }
}
