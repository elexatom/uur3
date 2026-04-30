/*
Finalni revize - 100%
 */

import type {Stop} from "../../../types/transit.ts"
import {estimateStopDelay} from "../../../services/simulationService.ts"
import {CircleMarker, Popup} from "react-leaflet"
import {Typography} from "@mui/material"
import {useSimulationStore} from "../../../store/simulationStore.ts"
import {useAppStore} from "../../../store/appStore.ts"

export const NetworkStopsSim = () => {
  const {metrics, disruptions} = useSimulationStore()
  const {network} = useAppStore()

  return (
    network.stops.map((stop: Stop) => {
      const delay = estimateStopDelay(stop.lat, stop.lng, metrics.delay, disruptions)
      const isDelayed = delay > 5

      return (
        <CircleMarker
          key={stop.id}
          center={[stop.lat, stop.lng]}
          radius={6}
          pathOptions={{
            fillColor: isDelayed ? '#ef4444' : '#cbd5e1',
            fillOpacity: 0.8,
            color: "#ffffff",
            weight: 1
          }}
        >
          <Popup>
            <span className="font-mono">{stop.name}</span>
            <Typography variant="caption" className="font-bold text-slate-500 block">
              Odhad zpoždění: <span className={isDelayed ? 'text-red-600' : 'text-slate-400'}>+{delay} min</span>
            </Typography>
          </Popup>
        </CircleMarker>
      )
    })
  )
}