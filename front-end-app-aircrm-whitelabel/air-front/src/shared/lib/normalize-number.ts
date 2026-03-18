export const normalizeNumber = (number: number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return 0
  }
  if (Number.isInteger(number)) {
    return number
  }
  return number.toFixed(2)
}
