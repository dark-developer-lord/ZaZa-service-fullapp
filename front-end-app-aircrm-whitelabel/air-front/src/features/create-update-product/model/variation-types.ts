export interface VariationType {
  id: string
  name: string
  isExisting?: boolean
}

export interface VariationDetail {
  attributeId: number | ''
  attributeValue: string
  costPrice: number | ''
  salePrice: number | ''
  quantity: number | ''
  barcode: string
}

export interface VariationErrors {
  attributeId?: string
  attributeValue?: string
  costPrice?: string
  salePrice?: string
  quantity?: string
  barcode?: string
}
