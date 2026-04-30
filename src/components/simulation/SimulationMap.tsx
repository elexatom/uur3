/*
Finalni revize - 100%
 */

import React, {useEffect} from 'react'
import {MapContainer, useMap, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {useSimulationStore} from '../../store/simulationStore'
import {BasemapSelector, BasemapTileLayer} from '../map/BasemapLayer'
import PinIcon from '@mui/icons-material/LocationPin'
import {MapDisruptions} from "./ui/MapDisruptions.tsx"
import {NetworkStopsSim} from "./ui/NetworkStopsSim.tsx"
import {NetworkSegmentsSim} from "./ui/NetworkSegmentsSim.tsx"

const MapResizer = () => {
  const map = useMap()
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => map.invalidateSize())
    const container = map.getContainer()
    if (container) resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [map])
  return null
}

const MapInteraction = () => {
  const {isMapInjectionMode, addDisruption} = useSimulationStore()

  useMapEvents({
    click(e) {
      if (!isMapInjectionMode) return

      addDisruption({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        label: 'Manuální událost',
        severity: 1,
        severityLabel: 'Střední',
        radius: 350
      })
    },
  })

  return null
}

export const SimulationMap: React.FC = () => {
  const {
    disruptions,
    isMapInjectionMode,
  } = useSimulationStore()

  return (
    <div className="w-full h-full relative overflow-hidden shadow-sm bg-slate-100">

      {isMapInjectionMode && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-1000 bg-blue-500 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xl animate-pulse pointer-events-none">
          <PinIcon fontSize={'small'} className="inline-block mr-2 -mt-1"/>
          Klikněte na mapu pro vložení události
        </div>
      )}

      <MapContainer
        center={[49.7437, 13.3736]}
        zoom={13}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <MapResizer/>
        <BasemapTileLayer/>
        <MapInteraction/>
        <NetworkSegmentsSim/>
        <NetworkStopsSim/>
        <MapDisruptions disruptions={disruptions}/>
      </MapContainer>

      <BasemapSelector className="absolute top-4 left-4 z-1000"/>
    </div>
  )
}