import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

export const addProductsSchema = yup.object().shape({
  product_count: yup
    .number()
    .transform(transformNumber)
    .positive('Количество должно быть больше 0')
    .test('decimal-places', 'Максимум 2 знака после запятой', (value) => {
      if (value === undefined || value === null) return true
      const decimalPlaces = value.toString().split('.')[1]?.length || 0
      return decimalPlaces <= 2
    })
    .required('Введите количество'),
  purchase_price: yup
    .number()
    .transform(transformNumber)
    .positive('Цена должна быть больше 0')
    .required('Введите цену закупки'),
})

export type AddProductsDto = yup.InferType<typeof addProductsSchema>
