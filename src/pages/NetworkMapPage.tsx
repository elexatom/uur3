/*
Finalni revize - 100%
 */

import {useAppStore} from "../store/appStore.ts"
import {useEffect, useMemo} from "react"
import {LayerSwitcher} from "../components/network/ui/LayerSelector.tsx"
import {MapStatusOverlay} from "../components/network/ui/MapStatusOverlay.tsx"
import {MapContainer} from "react-leaflet"
import {BasemapSelector, BasemapTileLayer} from "../components/map/BasemapLayer.tsx"
import type {Stop} from "../types/transit.ts"
import {Box, CircularProgress, Typography} from "@mui/material"
import {NetworkTreeView} from "../components/network/NetworkTreeView.tsx"
import {NetworkMapLeaflet} from "../components/map/LeafletMap"
import {NetworkMap3D} from "../components/map/NetworkMap3D.tsx"
import {MapSettings} from "../components/map/MapSettings.tsx"

export const NetworkMapPage = () => {
  const {
    selectedStopId,
    selectStop,
    selectLine,
    network,
    fetchNetworkData,
    mapMode
  } = useAppStore()

  useEffect(() => {
    if (network.stops.length === 0 && !network.isLoading) {
      fetchNetworkData()
    }
  }, [network.stops.length, network.isLoading, fetchNetworkData])

  const flyCenter = useMemo(() => {
    const stop = selectedStopId ? network.stops.find(s => s.id === selectedStopId) : null
    return stop ? [stop.lat, stop.lng] as [number, number] : null
  }, [selectedStopId, network.stops])

  const handleMapClick = () => {
    selectStop(null)
    selectLine(null)
  }

  const isMapReady = network.stops.length > 0 && !network.isLoading

  return (
    <div className="flex h-full overflow-hidden bg-slate-900">
      <aside className="w-65 shrink-0 border-r border-slate-200 flex flex-col bg-white z-[1001] shadow-xl relative">
        <NetworkTreeView/>
      </aside>

      <main className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-100">
        <MapStatusOverlay/>

        {!isMapReady && (
          <Box className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-100">
            <CircularProgress size={60} thickness={4} className="text-blue-600 mb-4"/>
            <Typography className="font-black text-slate-500 tracking-widest uppercase">
              Načítání telemetrie
            </Typography>
          </Box>
        )}

        {isMapReady && mapMode === '2d' && (
          <MapContainer
            center={[49.7437, 13.3736]}
            zoom={12}
            className="w-full h-full absolute inset-0 z-0"
            zoomControl={false}
          >
            <BasemapTileLayer/>
            <NetworkMapLeaflet
              flyTo={flyCenter}
              onStopClick={(stop: Stop) => selectStop(stop.id)}
              onMapClick={handleMapClick}
            />
          </MapContainer>
        )}

        {isMapReady && mapMode === '3d' && (
          <div className="w-full h-full absolute inset-0 z-0" onContextMenu={(e) => e.preventDefault()}>
            <NetworkMap3D
              flyTo={flyCenter}
              onStopClick={(stop: Stop) => selectStop(stop.id)}
              onMapClick={handleMapClick}
            />
          </div>
        )}

        <LayerSwitcher/>

        {isMapReady && mapMode === '2d' && (
          <BasemapSelector className="absolute z-40 bottom-3 left-3"/>
        )}

        <MapSettings/>
      </main>
    </div>
  )
}