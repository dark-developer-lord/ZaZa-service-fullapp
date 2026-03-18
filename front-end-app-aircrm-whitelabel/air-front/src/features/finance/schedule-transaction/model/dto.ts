import * as yup from 'yup'

export const scheduleTransactionSchema = yup.object().shape({
  counterparty_type: yup.string().required('Тип контрагента обязателен для заполнения'),
  counterparty_id: yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === 0) return undefined
      return value
    })
    .required('Контрагент обязателен для выбора'),
  transaction_type: yup.mixed()
    .test('is-required', 'Тип транзакции обязателен для выбора', (value) => {
      return value !== '' && value !== null && value !== undefined
    })
    .required('Тип транзакции обязателен для выбора'),
  transaction_category_id: yup.number()
    .transform((value, originalValue) => {
      // Handle string to number conversion
      if (typeof originalValue === 'string') {
        const parsed = parseInt(originalValue, 10)
        return isNaN(parsed) ? 0 : parsed
      }
      if (originalValue === '' || originalValue === null) return 0
      return value
    })
    .typeError('Категория должна быть числом')
    .positive('Категория обязательна для выбора')
    .required('Категория обязательна для выбора'),
  subcategory_id: yup.number()
    .transform((value, originalValue) => {
      // Handle string to number conversion
      if (typeof originalValue === 'string') {
        const parsed = parseInt(originalValue, 10)
        return isNaN(parsed) ? null : parsed
      }
      if (originalValue === '' || originalValue === null || originalValue === 0) return null
      return value
    })
    .nullable()
    .typeError('Подкатегория должна быть числом'),
  amount: yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null) return undefined
      if (typeof originalValue === 'string') {
        return parseFloat(originalValue.replace(',', '.'))
      }
      return value
    })
    .typeError('Сумма должна быть числом')
    .positive('Сумма должна быть положительной')
    .required('Сумма обязательна для заполнения'),
  cycle_type: yup.string()
    .required('Цикличность обязательна для выбора'),
  scheduled_date: yup.string()
    .required('Запланированная дата обязательна для заполнения'),
  end_date: yup.string()
    .nullable()
    .when('cycle_type', {
      is: (value: string) => value && value !== 'one_time',
      then: (schema) => schema
        .required('Дата окончания обязательна для заполнения')
        .test('is-after-start', 'Дата окончания должна быть после даты начала', function(value) {
          const { scheduled_date } = this.parent
          if (!value || !scheduled_date) return true
          // Parse dates in DD.MM.YYYY format
          const [startDay, startMonth, startYear] = scheduled_date.split('.').map(Number)
          const [endDay, endMonth, endYear] = value.split('.').map(Number)
          const startDate = new Date(startYear, startMonth - 1, startDay)
          const endDate = new Date(endYear, endMonth - 1, endDay)
          return endDate >= startDate
        }),
      otherwise: (schema) => schema.nullable(),
    }),
  description: yup.string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) return null
      return value
    }),
})

export type ScheduleTransactionDto = yup.InferType<typeof scheduleTransactionSchema>

