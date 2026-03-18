import * as yup from 'yup'

export const schema = yup.object().shape({
  f_name: yup.string().required('Введите имя'),
  l_name: yup.string().required('Введите фамилию'),
  phone: yup.string().checkPhone().required('Введите номер телефона'),
  addresses: yup.array().of(yup.string().required('Введите адрес')).nullable(),
})

export type Dto = yup.InferType<typeof schema>
