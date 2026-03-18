import { useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

import { polygonDto } from '../lib/polygon-dto'
import { Dto } from '../model/dto'

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

interface Props {
  setValue: UseFormSetValue<Dto>
}

export const Map = ({ setValue }: Props) => {
  const [polygon, setPolygon] = useState<any>(null)

  const handleCreated = (e: any) => {
    const { layerType, layer } = e
    if (layerType === 'polygon') {
      const { _leaflet_id, _latlngs } = layer
      if (polygon) {
        polygon.remove()
      }
      setPolygon(layer)
      setValue('coordinates', polygonDto(_latlngs))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnyMapContainer = MapContainer as any

  return (
    <AnyMapContainer
      center={[38.562018, 68.79576]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}" />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: !polygon,
          }}
        />
      </FeatureGroup>
    </AnyMapContainer>
  )
}
