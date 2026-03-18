export const generateOptionsPrice = (
  selectedOptions: Record<string, string[]>,
): Record<string, '' | number> => {
  const keys = Object.keys(selectedOptions)
  const combinations: string[] = []

  if (keys.length === 1) {
    const singleKey = keys[0]
    const optionsPrice: Record<string, '' | number> = {}
    selectedOptions[singleKey].forEach((option) => {
      optionsPrice[option] = ''
    })
    return optionsPrice
  }

  const generateCombinations = (prefix: string, index: number) => {
    if (index === keys.length) {
      combinations.push(prefix)
      return
    }

    const key = keys[index]
    selectedOptions[key].forEach((option) => {
      generateCombinations(prefix ? `${prefix}-${option}` : option, index + 1)
    })
  }

  generateCombinations('', 0)

  const optionsPrice: Record<string, '' | number> = {}
  combinations.forEach((combination) => {
    optionsPrice[combination] = ''
  })

  return optionsPrice
}
