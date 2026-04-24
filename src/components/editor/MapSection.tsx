// revidovano OK

import { MapContainer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Box, } from "@mui/material"
import { TYPE_COLORS } from "../../types/design.tsx"
import { useAppStore } from "../../store/appStore.ts"
import { EditorHUD, NetworkStops, RouteWaypoints } from "./ui/MapElements.tsx"
import type { Stop } from "../../types/transit.ts"
import { BasemapSelector, BasemapTileLayer } from "../map/BasemapLayer.tsx"

interface MapProps {
  osrmRoute: [number, number][];
  onStopClick: (stop: Stop) => void;
}

export default function MapSection({ osrmRoute, onStopClick }: MapProps) {
  const { network, routeConfig, removeWaypoint } = useAppStore()
  const typeColor = TYPE_COLORS[routeConfig.type] || TYPE_COLORS.bus

  return (
    <Box className="flex-1 relative bg-slate-100">
      <MapContainer center={[49.7437, 13.3736]} zoom={13} className="w-full h-full" zoomControl={true}>
        <BasemapTileLayer />

        <NetworkStops stops={network.stops} onStopClick={onStopClick}/>

        {osrmRoute.length > 1 && (
          <Polyline positions={osrmRoute} pathOptions={{ color: typeColor, weight: 5, opacity: 0.8 }}/>
        )}

        <RouteWaypoints waypoints={routeConfig.waypoints} typeColor={typeColor} removeWaypoint={removeWaypoint}/>
      </MapContainer>
      <BasemapSelector className="absolute z-[500] top-3 left-3" />
      <EditorHUD/>
    </Box>
  )
}