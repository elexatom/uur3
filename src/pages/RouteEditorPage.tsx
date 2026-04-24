// revidovano OK
// TODO: implementace volby basemap - globalne pro vsechny mapy 1 komponentu (reusable)

import React, { useCallback, useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"
import { Box } from "@mui/material"
import { useAppStore } from "../store/appStore"
import MapSection from "../components/editor/MapSection.tsx"
import EditorSidebar from "../components/editor/EditorSidebar.tsx"
import type { Stop } from "../types/transit.ts"


export const RouteEditorPage: React.FC = () => {
  const { routeConfig, addWaypoint, fetchNetworkData } = useAppStore()
  const osrmEndpoint = useAppStore((s) => s.settings.osrmEndpoint)
  const [osrmRoute, setOsrmRoute] = useState<[number, number][]>([])

  useEffect(() => {
    fetchNetworkData().then(() => {
      console.log("Data loaded for Route Editor")
    })
  }, [fetchNetworkData])

  const handleStopClick = useCallback((stop: Stop) => {
    addWaypoint(stop)
  }, [addWaypoint])

  useEffect(() => {
    const wps = routeConfig.waypoints
    if (wps.length < 2) return setOsrmRoute([])

    const coords = wps.map((w) => `${w.lng},${w.lat}`).join(";")
    fetch(`${osrmEndpoint}/${coords}?overview=full&geometries=geojson`)
      .then((r) => r.json())
      .then((data) => {
        if (data.routes?.[0]?.geometry?.coordinates) {
          setOsrmRoute(data.routes[0].geometry.coordinates.map(([lo, la]: number[]) => [la, lo]))
        }
      })
      .catch(() => setOsrmRoute(wps.map((w) => [w.lat, w.lng])))
  }, [routeConfig.waypoints, osrmEndpoint])

  return (
    <Box className="h-full flex overflow-hidden bg-white text-black">
      <MapSection
        osrmRoute={osrmRoute}
        onStopClick={handleStopClick}
      />

      <EditorSidebar/>
    </Box>
  )
}
