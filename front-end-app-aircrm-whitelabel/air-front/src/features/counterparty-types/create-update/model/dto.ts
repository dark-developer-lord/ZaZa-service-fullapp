import * as yup from 'yup'

export const schema = yup.object().shape({
  label: yup.string().required('Введите название типа контрагента'),
})

export type Dto = yup.InferType<typeof schema>

