import * as yup from 'yup'

const baseShape = {
  name: yup.string().required('Введите название категории'),
  parent_id: yup.number().required('Выберите родительскую категорию'),
}

export const schema = yup.object().shape({
  ...baseShape
})

export type Dto = yup.InferType<typeof schema>
