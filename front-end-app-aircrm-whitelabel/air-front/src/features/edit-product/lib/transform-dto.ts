import { Attribute } from '@entities/attribute'

import { Dto } from '../model/dto'

interface Props {
  dto: Dto
  attributes: Attribute[]
  image: File
  selectedAttributesOptions: Record<string, string[]>
  optionsPrice: Record<string, number | ''>
}

export const transformDto = ({
  dto,
  attributes,
  image,
  selectedAttributesOptions,
  optionsPrice,
}: Props) => {
  const formData = new FormData()
  formData.append('image', image)
  formData.append('name', dto.name)
  if (dto.description) {
    formData.append('description', dto.description)
  }
  formData.append('price', dto.price.toString())
  formData.append('category_id', dto.category_id.toString())
  formData.append('discount', dto.discount.toString())
  formData.append('restaurant_id', dto.restaurant_id.toString())
  formData.append('veg', dto.veg.toString())
  formData.append('available_time_starts', dto.available_time_starts)
  formData.append('available_time_ends', dto.available_time_ends)
  if (dto.sub_category_id) {
    formData.append('sub_category_id', dto.sub_category_id.toString())
  }
  if (dto.addon_ids) {
    dto.addon_ids.forEach((id) => {
      formData.append('addon_ids[]', id.toString())
    })
  }
  dto.attribute_id?.forEach((id) => {
    formData.append('attribute_id[]', id.toString())
    formData.append('choice_no[]', id.toString())
    const attribute = attributes.find((attribute) => attribute.id === id)
    formData.append('choice[]', attribute?.name || '')
  })
  formData.append('discount_type', dto.discount_type.toString())
  Object.keys(selectedAttributesOptions).forEach((key) => {
    formData.append(`${key}[]`, selectedAttributesOptions[key].join(','))
  })
  Object.keys(optionsPrice).forEach((key) => {
    formData.append(`price_${key}`, optionsPrice[key].toString())
  })
  return formData
}
