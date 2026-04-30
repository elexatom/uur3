/*
Finalni revize - 100%
 */

import "leaflet/dist/leaflet.css"
import {NetworkStops} from "../editor/ui/MapElements.tsx"
import type {Stop} from "../../types/transit.ts"
import {MapEvents, MapFitBounds, MapFlyTo} from "./helpers/MapAdjust.tsx"
import {useNetworkMap} from "../../services/useNetworkMap.ts"
import {SegmentLayer} from "./helpers/SegmentLayer.tsx"
import {SelectedLineLayer} from "./helpers/SelectedLineLayer.tsx"


interface NetworkMapLeafletProps {
  flyTo: [number, number] | null;
  onStopClick: (stop: Stop) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export function NetworkMapLeaflet({flyTo, onMapClick, onStopClick}: NetworkMapLeafletProps) {
  const {selectedStopId, selectedLine, routeCoords, filteredSegments, filteredStops, layers} = useNetworkMap()

  return (
    <>
      <MapFlyTo center={flyTo}/>
      <MapFitBounds bounds={routeCoords && routeCoords.length > 1 ? routeCoords : null}/>
      <MapEvents onClick={onMapClick}/>

      <SegmentLayer segments={filteredSegments} dimmed={!!selectedLine}/>

      {selectedLine && routeCoords && (
        <SelectedLineLayer routeCoords={routeCoords} stops={filteredStops} type={selectedLine.type}
                           onStopClick={onStopClick}/>
      )}

      {layers.showStops && !selectedLine && (
        <NetworkStops onStopClick={onStopClick} selectedStopId={selectedStopId} filter={false}/>
      )}
    </>
  )
}