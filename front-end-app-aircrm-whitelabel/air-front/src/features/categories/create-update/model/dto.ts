import * as yup from 'yup'

const baseShape = {
  name: yup.string().required('Введите название категории'),
  store_id: yup.number().required('Выберите магазин').nullable(),
  image: yup.mixed().required('Выберите изображение категории'),
  parent_id: yup.number().required('Выберите родительскую категорию'),
  position: yup.number().required('Введите позицию категории'),
}

export const createSchema = yup.object().shape({
  ...baseShape
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  name: yup.string().required('Введите название категории'),
  store_id: yup.number(),
  image: yup.mixed().nullable('Выберите изображение категории'),
  parent_id: yup.number().required('Выберите родительскую категорию'),
  position: yup.number().required('Введите позицию категории'),
})

export type UpdateDto = yup.InferType<typeof updateSchema>
