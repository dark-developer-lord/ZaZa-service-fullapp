import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

export const schema = yup.object().shape({
  name: yup.string().required('Введите название зоны'),
  per_km_delivery_charge: yup.number().transform(transformNumber).required(),
  minimum_delivery_charge: yup.number().transform(transformNumber).required(),
  coordinates: yup.string().required('Выделите зону на карте'),
})

export type Dto = yup.InferType<typeof schema>
