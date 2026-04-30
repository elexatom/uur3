/*
Finalni revize - 100%
 */

import {calculateSegmentCongestion, getTrafficColor} from "../../../services/simulationService.ts"
import {Polyline} from "react-leaflet"
import type {LatLngExpression} from "leaflet"
import {useSimulationStore} from "../../../store/simulationStore.ts"
import {useAppStore} from "../../../store/appStore.ts"

export const NetworkSegmentsSim = () => {
  const {metrics, disruptions} = useSimulationStore()
  const {network} = useAppStore()
  return (
    network.segments.map((seg) => {
      const midIdx = Math.floor(seg.coords.length / 2)
      const [midLat, midLng] = seg.coords[midIdx]
      const congestion = calculateSegmentCongestion(midLat, midLng, metrics.congestion, disruptions)

      return (
        <Polyline
          key={seg.id}
          positions={seg.coords as LatLngExpression[]}
          pathOptions={{
            color: getTrafficColor(congestion),
            weight: congestion > 60 ? 6 : 4,
            opacity: 0.8
          }}
        />
      )
    })
  )
}