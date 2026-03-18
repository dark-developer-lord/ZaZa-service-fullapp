import * as yup from 'yup'

export const counterpartySchema = yup.object().shape({
  counterparty: yup.string().required('Контрагент обязателен для заполнения'),
  name: yup.string().required('Наименование обязательно для заполнения'),
  type: yup.string().required('Тип обязателен для заполнения'),
  requisite: yup.string().optional(),
  address: yup.string().optional(),
  phone: yup.string().optional(),
  balance: yup.number()
    .transform((value, originalValue) => {
      // Handle empty string or null
      if (originalValue === '' || originalValue === null) return 0
      // Replace comma with dot for decimal numbers
      if (typeof originalValue === 'string') {
        return parseFloat(originalValue.replace(',', '.'))
      }
      return value
    })
    .typeError('Баланс должен быть числом')
    .required('Баланс обязателен для заполнения'),
  comment: yup.string().optional(),
  status: yup.string().required('Статус обязателен для заполнения'),
})

export type CounterpartyDto = yup.InferType<typeof counterpartySchema>

