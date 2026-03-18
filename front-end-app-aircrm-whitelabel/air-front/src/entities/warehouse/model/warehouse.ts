export interface ProductVariation {
    variation_id: string
    variation_type: string
    attribute_id: number
    attribute_value: string
    cost_price: number
    sale_price: number
    quantity: number
    barcode: string
  }

  export interface ProductItem {
    id: number
    name: string
    price: number
    image: string
    status: boolean,
    warehouse: {
      name: string,
    }
    quantity: number,
    category: {
      id: number
      name: string
      sub_categories: { id: number; name: string }[]
    }
    variations?: ProductVariation[]
  }

  export interface ArrivalItem {
    id: number
    receipt_number: string
    name: string
    status: string
    status_label: string
    is_refunded?: boolean
    warehouse: {
      id: number
      name: string
    }
    total_amount: number
    items_count: number
    items: Array<{
      id: number
      product: {
        id: number
        name: string
        code: string | null
        image: string | null
        variation_name: string | null
        categories: Array<{
          id: number
          name: string
        }>
        subcategories: Array<any>
        variations: Array<any>
      }
    }>
    notes: string | null
    received_at: string
    created_at: string
    updated_at: string
    counterparty: {
      id: number
      name: string
      type: string
      phone: string
    } | null
    recipient_vendor: {
      id: number
      name: string
      phone: string
    } | null
    warehouse_transfer: {
      id: number
      transfer_number: string
    } | null
  }

  export interface ArrivalItemEdit {
    id: number
    receipt_number: string
    name: string
    status: string
    status_label: string
    is_refunded?: boolean
    receipt_type?: string
    warehouse: {
      id: number
      name: string
    }
    counterparty: {
      id: number
      name: string
      type: string
      phone: string
    } | null
    total_amount: number
    items_count: number
    quantity?: number // Receipt-level total quantity
    items?: ReceiptItem[]
    notes: string | null
    received_at: string | null
    created_at: string
    updated_at: string
    products?: ArrivalProduct[]
    warehouse_transfer?: {
      id: number
      transfer_number: string
      transfer_type: string
      transfer_type_label: string
    } | null
  }

  export interface ReceiptItem {
    id: number
    image?: string | null
    product: {
      id: number
      name: string
      code: string | null
      image?: string | null
      variation_name?: string
      categories?: Array<{
        id: number
        name: string
      }>
      subcategories?: Array<{
        id: number
        name: string
      }>
      variations?: Array<{
        id: number
        variation_id: string
        variation_type: string
        attribute_id: number
        attribute_value: string
        cost_price: number
        sale_price: number
        quantity: number
        barcode: string | null
        type: number
        type_name: string
        type_label: string
        unit_price: number
        total_price: number
        created_at: string
      }>
    }
    variation: {
      id: number
      variation_id: string
      attribute_id: number
      attribute_value: string
      cost_price: number
      sale_price: number
      quantity: number
      barcode: string | null
    } | null
    quantity: number
    unit_price?: number
    purchase_price?: number
    retail_price?: number
    total_price: number
    created_at: string
  }

  export interface ArrivalProduct {
    product_id: number | null
    product_name: string
    product_code: string | null
    image: string | null
    has_variations: boolean
    purchase_price: number
    retail_price: number
    quantity: number
    variation_name?: string
    variation_types?: string[]
    variation_details?: Array<{
      variation_id: string
      attribute_id: number
      attribute_value: string
      cost_price: number
      sale_price: number
      quantity: number
      barcode: string | null
    }>
  }

  export interface SaleItem {
    name: string
    sale_name?: string | null
    id: number
    order_id: number
    order_number?: string | number
    status: string
    created_at: string
    warehouse: string
    user: string
    products_count: number
    total_price: number
    transfer_type?: 'external' | 'internal' | null
  }

  export interface TransferItem {
    id: number
    transfer_number: string
    name: string
    transfer_type: string
    status: string
    notes: string | null
    transferred_at: string | null
    received_at: string | null
    created_at: string
    updated_at: string
    from_warehouse: {
      id: number
      name: string
    } | null
    to_warehouse: {
      id: number
      name: string
    } | null
    from_vendor?: {
      id: number
      name: string
      phone: string
    } | null
    to_vendor?: {
      id: number
      name: string
      phone: string
    } | null
    receipt?: {
      id: number
      receipt_number: string
      status: string
      total_amount: string
    } | null
    // New API structure: products array with variations
    products?: Array<{
      id: number
      name: string
      image: string
      product_code: string | null
      variation_name: string | null
      variations: Array<{
        item_id: number
        product_variation_id: number
        variation_id: string
        variation_type: string
        attribute_value: string
        barcode: string
        quantity: number
        cost_price: number
        sale_price: number
        total_cost_price: number
        total_sale_price: number
        notes: string | null
      }>
    }>
    // Old API structure: items array (for backward compatibility)
    items?: Array<{
      id: number
      product_id: number
      product: {
        id: number
        name: string
        image: string
        product_code: string | null
        price: number
        purchase_price: number
        quantity: string
        warehouse_id: number | null
      }
      product_variation_id: number | null
      product_variation: Array<{
        id: number | null
        variation_id: string
        variation_type: string
        name: string
        attribute_id: string
        attribute_value: string
        cost_price: number
        sale_price: number
        quantity: number
        barcode: string
      }> | null
      quantity: number
      sale_price: number
      cost_price: number
      available_quantity: string
      total_sale_price: number
      total_cost_price: number
      notes: string | null
      created_at: string
    }>
    total_quantity: number
    total_sale_price: number
    total_cost_price: number
  }

  export interface InventoryItem {
    id: number
    name: string
    status: string
    status_label?: string
    created_at: string
    warehouse: {
      id: number
      name: string
    }
    quantity: number
    total_amount: number
  }