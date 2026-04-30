/*
Finalni revize - 100%
 */

import {CircleMarker, Polyline, Popup} from 'react-leaflet'
import type {LatLngExpression} from 'leaflet'
import type {Stop, TransitType} from '../../../types/transit'
import {TYPE_COLORS} from "../../../types/design.tsx"

interface Props {
  routeCoords: [number, number][]
  stops: Stop[]
  type: TransitType
  onStopClick: (stop: Stop) => void
}

export const SelectedLineLayer = ({routeCoords, stops, type, onStopClick}: Props) => {
  const color = TYPE_COLORS[type]

  return (
    <>
      <Polyline positions={routeCoords as LatLngExpression[]}
                pathOptions={{color, weight: 18, opacity: 0.15, lineJoin: 'round'}}/>
      <Polyline positions={routeCoords as LatLngExpression[]}
                pathOptions={{color, weight: 6, opacity: 0.95, lineJoin: 'round'}}/>

      {stops.map((stop, i) => (
        <CircleMarker key={`${stop.id}-${i}`} center={[stop.lat, stop.lng]} radius={5}
                      pathOptions={{color, fillColor: '#fff', fillOpacity: 1, weight: 2.5}}
                      eventHandlers={{click: () => onStopClick(stop)}}
        >
          <Popup>
            <div className='font-bold text-sm'>{stop.name}</div>
            <div style={{fontSize: 11, color: '#666'}}>ID: {stop.gpsId ?? stop.id}</div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  )
}
