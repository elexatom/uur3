import { useEffect, useMemo } from "react"
import { Polyline, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useAppStore } from "../../store/appStore"
import type { LatLngExpression } from "leaflet"
import { NetworkStops } from "../editor/ui/MapElements.tsx"
import type { Stop } from "../../types/transit.ts"
import { TYPE_COLORS } from "../../types/design.tsx"

const MapFlyTo = ({ center, zoom = 15 }: { center: [number, number] | null; zoom?: number }) => {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.2 })
  }, [center, map, zoom])
  return null
}

const MapEvents = ({ onClick }: { onClick?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => onClick && onClick(e.latlng.lat, e.latlng.lng),
  })
  return null
}

interface NetworkMapLeafletProps {
  onStopClick: (stop: Stop) => void;
  flyTo: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
}

export function NetworkMapLeaflet({ flyTo, onMapClick, onStopClick }: NetworkMapLeafletProps) {
  const { network, layers, selectedStopId, selectedLineId } = useAppStore()

  const selectedLine = useMemo(() =>
      selectedLineId ? network.lines.find(l => l.id === selectedLineId) : null
    , [selectedLineId, network.lines])

  const filteredStops = useMemo(() => {
    if (!selectedLine) return network.stops

    const lineStopIds = selectedLine.stopIds || []
    const lineStopNames = selectedLine.stops || []

    if (lineStopIds.length > 0) return network.stops.filter(s => lineStopIds.includes(s.id))
    if (lineStopNames.length > 0) return network.stops.filter(s => lineStopNames.includes(s.name))

    return []
  }, [network.stops, selectedLine])

  // Opravené filtrování - nevyhazuje segmenty při výběru linky
  const filteredSegments = useMemo(() => {
    return network.segments.filter(seg => {
      // Fallback: Pokud segment nemá definovaný typ v datech, bereme ho jako bus, aby z mapy nezmizel
      const isTram = !!seg.isTram
      const isTrol = !!seg.isTrol
      const isBus = !isTram && !isTrol ? true : !!seg.isBus

      // Zobrazit pouze ty, které mají zapnutou vrstvu v UI
      return (
        (isTram && layers.showTrams) ||
        (isBus && layers.showBuses) ||
        (isTrol && layers.showTrolleys)
      )
    })
  }, [network.segments, layers])

  return (
    <>
      <MapFlyTo center={flyTo}/>
      <MapEvents onClick={onMapClick}/>

      {filteredSegments.map((seg) => {
        const isTram = !!seg.isTram
        const isTrol = !!seg.isTrol

        const defaultColor = isTram ? TYPE_COLORS.tram : (isTrol ? TYPE_COLORS.trolley : TYPE_COLORS.bus)

        // Zjištění, zda segment patří k typu aktuálně vybrané linky
        const isSelectedType = selectedLine && (
          (selectedLine.type === "tram" && isTram) ||
          (selectedLine.type === "bus" && !isTram && !isTrol) ||
          (selectedLine.type === "trolley" && isTrol)
        )

        // Barva a průhlednost podle toho, zda je linka vybraná
        const color = (selectedLine && isSelectedType) ? (selectedLine.color || defaultColor) : defaultColor
        const opacity = selectedLine ? (isSelectedType ? 0.9 : 0.2) : 0.7

        return (
          <Polyline
            key={seg.id}
            positions={seg.coords as LatLngExpression[]}
            pathOptions={{
              color,
              weight: isTram ? 4 : 3,
              opacity
            }}
          />
        )
      })}

      {layers.showStops && (
        <NetworkStops stops={filteredStops} onStopClick={onStopClick} selectedStopId={selectedStopId}/>
      )}
    </>
  )
}