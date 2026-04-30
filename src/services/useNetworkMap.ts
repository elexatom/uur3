import {useAppStore} from "../store/appStore.ts"
import {useMemo} from "react"

export const useNetworkMap = () => {
  const {network, layers, selectedStopId, selectedLineId} = useAppStore()

  const selectedLine = useMemo(() =>
      network.lines.find(line => line.id === selectedLineId) ?? null,
    [network.lines, selectedLineId]
  )

  const filteredStops = useMemo(() => {
    if (!selectedLine) return network.stops
    const stops = selectedLine.stops ?? []
    const ids = stops.map((s: any) => String(s.stop_id || s.code || s.id))
    const names = stops.map((s: any) => String(s.name ?? '').toLowerCase().trim())
    return network.stops.filter(s =>
      ids.includes(String(s.gpsId)) ||
      ids.includes(String(s.id)) ||
      names.includes(s.name.toLowerCase().trim())
    )
  }, [network.stops, selectedLine])

  const routeCoords = useMemo(() => {
    if (!selectedLine) return null
    if (selectedLine.geometry?.coordinates)
      return selectedLine.geometry.coordinates.map(([lng, lat]: any) => [lat, lng] as [number, number])
    return (selectedLine.stops ?? []).map((s: any) => [s.lat, s.lon ?? s.lng] as [number, number])
  }, [selectedLine])

  const filteredSegments = useMemo(() => {
    return network.segments.filter(seg => {
      const {isTram, isTrol} = seg
      const isBus = !isTram && !isTrol ? true : seg.isBus
      const visible =
        (isTram && layers.showTrams) ||
        (isBus && layers.showBuses) ||
        (isTrol && layers.showTrolleys)
      if (!visible) return false
      if (!selectedLine) return true
      return (
        (selectedLine.type === 'tram' && isTram) ||
        (selectedLine.type === 'bus' && isBus) ||
        (selectedLine.type === 'trolley' && isTrol)
      )
    })
  }, [network.segments, layers, selectedLine])

  return {selectedLine, filteredStops, routeCoords, filteredSegments, selectedStopId, layers}
}