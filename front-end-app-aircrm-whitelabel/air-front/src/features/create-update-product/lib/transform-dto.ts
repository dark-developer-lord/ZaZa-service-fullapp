import { CreateDto, UpdateDto } from '../model/dto'
import { VariationDetail } from '../model/variation-types'

interface Props {
  dto: CreateDto | UpdateDto
  image?: File
  variationDetails?: Record<string, VariationDetail>
}

function isCreateDto(dto: CreateDto | UpdateDto): dto is CreateDto {
  return dto.hasOwnProperty('warehouse_id')
}

export const transformDto = ({
  dto,
  image,
  variationDetails = {},
}: Props) => {
  const formData = new FormData()

  // Basic product information
  if (image) {
    formData.append('image', image)
  }
  formData.append('name', dto.name)
  if (dto.description) {
    formData.append('description', dto.description)
  }
  if (isCreateDto(dto)) {
    formData.append('warehouse_id', dto.warehouse_id.toString())
  }

  // Base product pricing (will be overridden by variations)
  // If variations exist, calculate from variations; otherwise use form values
  const hasVariations = Object.keys(variationDetails).length > 0

  if (hasVariations) {
    // Calculate average prices from variations
    const variationValues = Object.values(variationDetails)
    const avgCostPrice = variationValues.reduce((sum, detail) => sum + (parseFloat(detail.costPrice as string) || 0), 0) / variationValues.length
    const avgSalePrice = variationValues.reduce((sum, detail) => sum + (parseFloat(detail.salePrice as string) || 0), 0) / variationValues.length

    formData.append('purchase_price', avgCostPrice.toString())
    formData.append('price', avgSalePrice.toString())
  } else {
    // Use form values if no variations
    formData.append('purchase_price', (dto.purchase_price || 0).toString())
    formData.append('price', (dto.price || 0).toString())
  }

  // Product quantity is now sum of all variation quantities
  const totalQuantity = hasVariations
      ? Object.values(variationDetails).reduce((sum, detail) => sum + (parseFloat(detail.quantity as string) || 0), 0)
    : (dto.quantity || 0)
  formData.append('quantity', totalQuantity.toString())

  if (dto.product_code) {
    formData.append('product_code', dto.product_code)
  }
  formData.append('category_id', dto.category_id.toString())
  if (dto.sub_category_id) {
    formData.append('sub_category_id', dto.sub_category_id.toString())
  }
  formData.append('variation_type', dto.variation_type.toString())
  formData.append('discount', dto.discount.toString())
  if (dto.discount_type) {
    formData.append('discount_type', dto.discount_type.toString())
  } else {
    formData.append('discount_type', 'percent')
  }

  // New variation structure
  if (dto.variation_name) {
    formData.append('variation_name', dto.variation_name)
  }

  // Add variation types array
  if (dto.variation_types && dto.variation_types.length > 0) {
    dto.variation_types.forEach((type) => {
      formData.append('variation_types[]', type)
    })
  }

  // Add variation details with individual quantities and prices
  if (Object.keys(variationDetails).length > 0) {
    let index = 0
    Object.entries(variationDetails).forEach(([variationId, detail]) => {
      formData.append(`variation_details[${index}][variation_id]`, variationId)
      formData.append(`variation_details[${index}][attribute_id]`, detail.attributeId.toString())
      formData.append(`variation_details[${index}][attribute_value]`, String(detail.attributeValue))
      formData.append(`variation_details[${index}][cost_price]`, (parseFloat(detail.costPrice as string) || 0).toString())
      formData.append(`variation_details[${index}][sale_price]`, (parseFloat(detail.salePrice as string) || 0).toString())
      formData.append(`variation_details[${index}][quantity]`, (parseFloat(detail.quantity as string) || 0).toString())
      if (detail.barcode) {
        formData.append(`variation_details[${index}][barcode]`, detail.barcode)
      }
      index++
    })
  }

  // Add counterparty_id (supplier) if selected
  if (dto.counterparty_id) {
    formData.append('counterparty_id', dto.counterparty_id.toString())
  }

  return formData
}

// Alias for backward compatibility
export const transformCreateProductDto = transformDto
