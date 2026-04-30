/*
Finalni revize - 100%
 */

import type {Stop} from "../../../types/transit.ts"
import {createWaypointIcon, TYPE_COLORS} from "../../../types/design.tsx"
import {CircleMarker, Marker, Popup} from "react-leaflet"
import L from "leaflet"
import {Box, Button} from "@mui/material"
import {useAppStore} from "../../../store/appStore.ts"

interface NetworkStopsProps {
  onStopClick: (stop: Stop) => void
  selectedStopId: number | null
  filter: boolean
}

export const NetworkStops = ({onStopClick, selectedStopId, filter}: NetworkStopsProps) => {
  const {routeConfig, network} = useAppStore()

  return network.stops.map((stop: Stop) => {
    const stopColor = TYPE_COLORS[stop.type] || TYPE_COLORS.bus

    if (routeConfig.type === stop.type ||
      (routeConfig.type === "bus" && stop.type === "trolley") ||
      (routeConfig.type === "trolley" && stop.type === "bus") ||
      !filter
    ) {
      return (
        <CircleMarker
          key={stop.id}
          center={[stop.lat, stop.lng]}
          radius={stop.id === selectedStopId ? 10 : 6}
          pathOptions={{
            fillColor: stop.id === selectedStopId ? "#9c27b0" : stopColor,
            fillOpacity: 0.8,
            color: "#ffffff",
            weight: 1
          }}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e.originalEvent)
              onStopClick(stop)
            }
          }}
        >
          <Popup><span className="font-mono">{stop.name}</span></Popup>
        </CircleMarker>
      )
    }
  })
}

interface RouteWaypointsProps {
  typeColor: string
}

export const RouteWaypoints = ({typeColor}: RouteWaypointsProps) => {
  const {routeConfig, removeWaypoint} = useAppStore()

  return routeConfig.waypoints.map((wp: Stop, i: number) => (
    <Marker key={wp.id} position={[wp.lat, wp.lng]} icon={createWaypointIcon(typeColor, i + 1)}>
      <Popup>
        <Box className="p-1 text-center flex flex-col items-left gap-2">
          <span className="font-mono">#{i + 1} {wp.name}</span>
          <Button size="small" color="error" variant="outlined" style={{textTransform: "none" as const}}
                  onClick={() => removeWaypoint(wp.id)}
                  className="mt-1 font-bold text-[10px]"
          >
            Odebrat
          </Button>
        </Box>
      </Popup>
    </Marker>
  ))
}

export const EditorHUD = () => (
  <Box
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-1000 px-4 py-1 rounded-2xl shadow-xl bg-white/70 backdrop-blur-md gap-4"
  >
      <span className="text-xs text-black leading-none">
        Kliknutím na zastávku ji přidáte do nové trasy.
      </span>
  </Box>
)