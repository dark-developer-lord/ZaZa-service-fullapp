export const transformNumber = (value: number) =>
  Number.isNaN(value) ? undefined : value
