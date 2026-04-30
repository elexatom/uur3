/*
Finalni revize - 100%
 */

import {useEffect, useMemo, useState} from 'react'
import {WebMercatorViewport} from '@deck.gl/core'
import {useAppStore} from '../store/appStore'
import {isVisible, matchesLine} from "./mapUtils.ts"

const PLZEN = {longitude: 13.3776, latitude: 49.7475, zoom: 13, pitch: 50, bearing: 0, transitionDuration: 0}

export const useMap3D = (flyTo: [number, number] | null) => {
  const {network, layers, selectedStopId, selectedLineId} = useAppStore()
  const [viewState, setViewState] = useState(PLZEN)

  // najit vybranou linku
  const selectedLine = useMemo(() =>
      network.lines.find(l => l.id === selectedLineId) ?? null
    , [selectedLineId, network.lines])

  // ziskat souradnice linky - geometrie nebo zastavky
  const routeCoords = useMemo((): [number, number][] | null => {
    if (!selectedLine) return null

    // geometrie
    if (selectedLine.geometry?.coordinates) {
      return selectedLine.geometry.coordinates
    }

    // jinak zastavky
    if (selectedLine.stops) {
      return selectedLine.stops.map((s: any) => {
        const lng = Number(s.lon ?? s.lng)
        const lat = Number(s.lat)
        return [lng, lat] as [number, number]
      })
    }

    return null
  }, [selectedLine])

  // filtrace zastavek podle linky - porovnat id, code i name, protoze data jsou dost nekonzistentni
  const filteredStops = useMemo(() => {
    if (!selectedLine || !selectedLine.stops) return network.stops

    const rawStops = selectedLine.stops as any[]
    const validIds = new Set(rawStops.flatMap(s => [String(s.stop_id), String(s.code), String(s.id)]))
    const validNames = new Set(rawStops.map(s => String(s.name ?? '').toLowerCase().trim()))

    return network.stops.filter(s =>
      validIds.has(String(s.gpsId)) || validIds.has(String(s.id)) || validNames.has(s.name.toLowerCase().trim())
    )
  }, [network.stops, selectedLine])

  // filtrace segmentu podle linky
  const filteredSegments = useMemo(() =>
    network.segments.filter(seg =>
      isVisible(seg, layers) && (!selectedLine || matchesLine(seg, selectedLine.type))
    ), [network.segments, layers, selectedLine]
  )

  // ovladani kamery
  // manualni prelet na bod
  useEffect(() => {
    if (flyTo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViewState(prev => ({
        ...prev, latitude: flyTo[0], longitude: flyTo[1], zoom: 16, transitionDuration: 1000
      }))
    }
  }, [flyTo])

  // zobrazit vybranou linku
  useEffect(() => {
    if (!routeCoords || routeCoords.length < 2) return

    // bounds
    const minLng = Math.min(...routeCoords.map(c => c[0]))
    const maxLng = Math.max(...routeCoords.map(c => c[0]))
    const minLat = Math.min(...routeCoords.map(c => c[1]))
    const maxLat = Math.max(...routeCoords.map(c => c[1]))

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewState(prev => {
      // zohlednit levy panel
      const width = window.innerWidth > 500 ? window.innerWidth - 380 : window.innerWidth
      const height = window.innerHeight

      try {
        const vp = new WebMercatorViewport({...prev, width, height})
        const {longitude, latitude, zoom} = vp.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          {padding: 80}
        )
        return {...prev, longitude, latitude, zoom: Math.min(zoom, 16), transitionDuration: 1200}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return prev
      }
    })
  }, [routeCoords])

  return {selectedLine, filteredStops, filteredSegments, routeCoords, selectedStopId, layers, viewState, setViewState}
}