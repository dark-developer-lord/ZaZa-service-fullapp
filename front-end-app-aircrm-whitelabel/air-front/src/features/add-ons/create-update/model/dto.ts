import * as yup from 'yup'

export const createSchema = yup.object().shape({
  name: yup.string().required('Введите название дополнения'),
  restaurant_id: yup.number().required('Выберите ресторан'),
  price: yup.number().required('Введите цену дополнения'),
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = createSchema

export type UpdateDto = yup.InferType<typeof updateSchema>
