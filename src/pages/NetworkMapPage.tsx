// revidovano OK

import React, { useMemo } from "react"
import { MapContainer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { NetworkMapLeaflet } from "../components/map/LeafletMap"
import { NetworkTreeView } from "../components/network/NetworkTreeView.tsx"
import { useAppStore } from "../store/appStore"
import Departures from "../components/network/Departures.tsx"
import { BasemapSelector, BasemapTileLayer } from "../components/map/BasemapLayer.tsx"
import type { Stop } from "../types/transit.ts"
import { LayerSwitcher } from "../components/network/ui/LayerSelector.tsx"
import { MapStatusOverlay } from "../components/network/ui/MapStatusOverlay.tsx"

export const NetworkMapPage: React.FC = () => {
  const {
    selectedStopId,
    selectStop,
    selectLine,
    network,
  } = useAppStore()

  const flyCenter = useMemo(() => selectedStopId ? network.stops.find(s => s.id === selectedStopId) : null, [selectedStopId, network.stops])

  const handleMapClick = () => {
    selectStop(null)
    selectLine(null)
  }

  const isMapReady = !network.isLoading && !network.error

  return (
    <div className="flex h-full overflow-hidden bg-gray-50">
      <aside className="w-65 shrink-0 border-r border-gray-200 flex flex-col bg-white z-50">
        <NetworkTreeView/>
      </aside>

      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        <MapStatusOverlay/>

        {isMapReady && (
          <MapContainer
            center={[49.7437, 13.3736]}
            zoom={12}
            className="w-full h-full absolute inset-0 z-0"
            zoomControl={false}
          >
            <BasemapTileLayer/>
            <NetworkMapLeaflet
              flyTo={flyCenter ? [flyCenter.lat, flyCenter.lng] : null}
              onStopClick={(stop: Stop) => selectStop(stop.id)}
              onMapClick={handleMapClick}
            />
          </MapContainer>
        )}

        <LayerSwitcher/>
        <BasemapSelector className="absolute z-40 top-3 left-3"/>
        <Departures/>
      </main>
    </div>
  )
}

