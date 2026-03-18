type Props = [{ lat: number; lng: number }[]]

export const polygonDto = (coordinates: Props): string => {
  return coordinates[0]
    .map((coordinate) => {
      return `(${coordinate.lat}, ${coordinate.lng})`
    })
    .join(',')
}
