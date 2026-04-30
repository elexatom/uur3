/*
Finalni revize - 100%
 */

import { useEffect } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

export const MapFlyTo = ({ center, zoom = 15 }: { center: [number, number] | null; zoom?: number }) => {
  const map = useMap() as L.Map
  useEffect(() => { if (center) map.flyTo(center, zoom, { duration: 1.2 }) }, [center, map, zoom])
  return null
}

export const MapFitBounds = ({ bounds }: { bounds: [number, number][] | null }) => {
  const map = useMap() as L.Map
  useEffect(() => {
    if (bounds && bounds.length > 1) map.fitBounds(bounds, { padding: [50, 50], duration: 1.2 } as any)
  }, [bounds, map])
  return null
}

export const MapEvents = ({ onClick }: { onClick?: (lat: number, lng: number) => void }) => {
  useMapEvents({ click: (e) => onClick?.(e.latlng.lat, e.latlng.lng) })
  return null
}