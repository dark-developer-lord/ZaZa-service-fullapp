import * as yup from 'yup'

import { removeSpaces } from '@shared/lib'

export const supplierSchema = yup.object().shape({
  counterparty: yup.string().required('Наименование компании обязательно для заполнения'),
  name: yup.string().required('ФИО обязательно для заполнения'),
  requisite: yup.string().optional(),
  type: yup.string().required('Тип контрагента обязателен для заполнения'),
  address: yup.string().optional(),
  phone: yup
    .string()
    .transform(removeSpaces)
    .checkInternationalPhone('Номер телефона должен начинаться с + (международный формат)')
    .required('Номер телефона обязателен для заполнения'),
  notes: yup.string().optional(),
  status: yup.string().required('Статус обязателен для заполнения'),
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
    .default(0),
})

export type SupplierDto = yup.InferType<typeof supplierSchema>
