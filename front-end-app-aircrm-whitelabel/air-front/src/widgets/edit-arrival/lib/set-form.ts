import { UpdateArrivalDto } from '@features/create-arrival'
import { ArrivalItemEdit } from '@entities/warehouse'

export const setForm = (arrival: ArrivalItemEdit): UpdateArrivalDto => {
  const counterparty = arrival.counterparty
  const recipientVendor = (arrival as any).recipient_vendor

  // Prefer counterparty; fall back to recipient_vendor when counterparty is null
  const partnerName = counterparty?.name || recipientVendor?.name || ''
  const partnerPhone = counterparty?.phone || recipientVendor?.phone || ''
  // Backend does not provide company/address/inn for recipient vendor — show N/A in Russian
  const partnerCompany = counterparty?.name || recipientVendor?.name || 'Н/Д'
  const partnerAddress = counterparty ? '' : 'Н/Д'
  const partnerInn = counterparty ? '' : 'Н/Д'

  // Convert items from API to products for the form
  const products = (arrival.items || []).map((item) => {
    // Check if product has variations: either variations array has items, or item has a variation object
    const hasVariations = (item.product.variations && item.product.variations.length > 0) || (item.variation != null)

    // Get prices: prioritize item-level prices, then variation prices, then unit_price
    let purchasePrice = 0
    let retailPrice = 0

    if (hasVariations && item.product.variations && item.product.variations.length > 0) {
      // For products with variations, use first variation's cost_price and sale_price
      purchasePrice = item.product.variations[0].cost_price || 0
      retailPrice = item.product.variations[0].sale_price || 0
    } else {
      // For products without variations, use item-level prices if available, otherwise unit_price
      purchasePrice = item.purchase_price ?? item.unit_price ?? 0
      retailPrice = item.retail_price ?? item.unit_price ?? 0
    }

    // Get existing image from item or product
    const existingImage = item.image || item.product.image || null

    // Get quantity: 
    // 1. First check if item has a direct quantity field
    // 2. Check if item has a variation with quantity
    // 3. For products with variations array, sum up all variation quantities
    // 4. Try to calculate from total_price / unit_price if available
    // 5. For products without variations, if there's only one item, use receipt-level quantity
    // 6. Otherwise default to 0
    let quantity = 0
    
    if (item.quantity !== undefined && item.quantity !== null && item.quantity > 0) {
      quantity = item.quantity
    } else if (item.variation && item.variation.quantity !== undefined && item.variation.quantity > 0) {
      quantity = item.variation.quantity
    } else if (item.product.variations && item.product.variations.length > 0) {
      // Sum up quantities from all variations
      quantity = item.product.variations.reduce((sum, variation) => {
        return sum + (variation.quantity || 0)
      }, 0)
    } else if (item.total_price !== undefined && item.unit_price !== undefined && item.unit_price > 0) {
      // Calculate quantity from total_price / unit_price as fallback
      quantity = Math.round((item.total_price / item.unit_price) * 100) / 100
    } else if (!hasVariations && arrival.items && arrival.items.length === 1 && arrival.quantity) {
      // For products without variations, if there's only one item, use receipt-level quantity
      quantity = arrival.quantity
    }
    
    // Ensure quantity is a valid number
    quantity = quantity > 0 ? quantity : 0

    return {
      product_id: item.product.id,
      product_name: item.product.name,
      product_code: item.product.code || '',
      image: existingImage,
      category_id: item.product.categories?.[0]?.id || null,
      sub_category_id: item.product.subcategories?.[0]?.id || null,
      has_variations: hasVariations,
      purchase_price: purchasePrice,
      retail_price: retailPrice,
      quantity: quantity,
    }
  })

  return {
    name: arrival.name.replace(/^Receipt for product:\s*/i, ''), // Remove "Receipt for product: " prefix
    counterparty_id: counterparty?.id || recipientVendor?.id || 0,
    counterparty_name: partnerName,
    contact: partnerPhone,
    company_name: partnerCompany,
    address: partnerAddress,
    inn: partnerInn,
    warehouse_id: arrival.warehouse?.id || 0,
    products: products,
    status: arrival.status
  }
}
