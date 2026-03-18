export const sortObjectKeys = <T extends Record<string, unknown>>(
  entry: T,
): T => {
  return Object.keys(entry)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = entry[key]
        return acc
      },
      {} as Record<string, unknown>,
    ) as T
}
