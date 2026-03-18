export const validateAttributes = (
  data: Record<string, string[]>,
): Record<string, string> => {
  const errors: Record<string, string> = {}
  Object.keys(data).forEach((key) => {
    if (data[key].length === 0) {
      errors[key] = 'Введите опции'
    }
  })
  return errors
}

export const validateOptionsPrice = (
  data: Record<string, number | ''>,
): Record<string, string> => {
  const errors: Record<string, string> = {}
  Object.keys(data).forEach((key) => {
    if (data[key] === '') {
      errors[key] = 'Введите цену'
    }
  })
  return errors
}
