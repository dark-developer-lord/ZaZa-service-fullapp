import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

const baseSchema = {
  title: yup.string().required('Введите заголовок баннера'),
  image: yup.mixed().required('Выберите изображение'),
  restaurant_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите ресторан'),
}

export const createSchema = yup.object().shape({
  ...baseSchema,
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  ...baseSchema,
  image: yup.mixed().nullable(),
})

export type UpdateDto = yup.InferType<typeof updateSchema>
