import * as yup from 'yup'

export const createSchema = yup.object().shape({
  name: yup.string().required('Введите название атрибута'),
  store_id: yup.number().required('Выберите магазин').nullable(), 
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  name: yup.string().required('Введите название атрибута'),
  store_id: yup.number(),
})
export type UpdateDto = yup.InferType<typeof updateSchema>
