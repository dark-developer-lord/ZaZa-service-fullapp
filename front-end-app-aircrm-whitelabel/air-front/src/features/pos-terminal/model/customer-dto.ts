import * as yup from 'yup'

import { removeSpaces } from '@shared/lib'

// Custom date validation for DD.MM.YYYY format
const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/
const validateDate = (value: string | undefined) => {
  if (!value) return true // Allow empty values since it's nullable

  const match = value.match(dateRegex)
  if (!match) return false

  const [, day, month, year] = match
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

  return (
    date.getDate() === parseInt(day) &&
    date.getMonth() === parseInt(month) - 1 &&
    date.getFullYear() === parseInt(year) &&
    date <= new Date() // Can't be in the future
  )
}

export const customerSchema = yup.object().shape({
  name: yup.string().required('Поле обязательно для заполнения'),
  phone: yup
    .string()
    .transform(removeSpaces)
    .checkPhone()
    .required('Поле обязательно для заполнения'),
  address: yup.string().optional(),
  birthdate: yup
    .string()
    .optional()
    .test('valid-date', 'Неверный формат даты (ДД.ММ.ГГГГ)', validateDate),
  source: yup.string().optional(),
  loyalty_enabled: yup.boolean().optional(),
  loyalty_percentage: yup
    .number()
    .min(0, 'Процент не может быть отрицательным')
    .max(100, 'Процент не может быть больше 100')
    .test('decimal', 'Процент может иметь максимум 2 знака после запятой', (value) => {
      if (value === undefined || value === null) return true
      return Number.isInteger(value * 100) // Allows up to 2 decimal places
    })
    .optional(),
  manual_points_reason: yup.string().optional(),
})

export type CustomerDto = yup.InferType<typeof customerSchema>
