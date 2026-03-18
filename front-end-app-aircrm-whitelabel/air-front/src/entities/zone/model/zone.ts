export interface Zone {
  id: number
  name: string
}

export interface ZoneItem {
  id: number
  name: string
  coordinates: {
    type: 'Polygon'
    coordinates: [[[number, number]]]
  }
}
