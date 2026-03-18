import { UpdateProductDto } from '@features/create-update-product'
import { FoodEdit } from '@entities/finance/model/food'

export const setForm = (food: FoodEdit): UpdateProductDto => {
  // Handle null/undefined category_ids
  const categoryId: string | number | undefined = food.category_ids?.find(
    (category) => category.position === 1,
  )?.id
  const subCategoryId: string | number | undefined = food.category_ids?.find(
    (category) => category.position === 2,
  )?.id

  return {
    name: food.name,
    description: food.description,
    purchase_price: food.purchase_price,
    quantity: food.quantity,
    price: food.price,
    product_code: food.product_code,
    image: food.image,
    category_id: categoryId ? Number(categoryId) : ('' as unknown as number),
    discount: food.discount,
    discount_type: food.discount_type,
    sub_category_id: subCategoryId
      ? Number(subCategoryId)
      : ('' as unknown as number),
    available_time_starts: food.available_time_starts,
    available_time_ends: food.available_time_ends,
    variation_name: food.variation_name || '',
    variation_types: [],
    variation_details: {},
  } as unknown as UpdateProductDto
}
