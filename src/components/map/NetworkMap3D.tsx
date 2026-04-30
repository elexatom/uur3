/*
Finalni revize - 100%
 */

import {Box} from '@mui/material'
import DeckGL from '@deck.gl/react'
import {Map} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

import type {Stop} from '../../types/transit'
import {useMap3D} from '../../services/useMap3D'
import {useDeckLayers} from '../../services/useDeckLayers'
import {BuildingsLayer} from './helpers/BuildingLayer.tsx'

interface Props {
  flyTo: [number, number] | null
  onStopClick: (stop: Stop) => void
  onMapClick?: (lat: number, lng: number) => void
}

export function NetworkMap3D({flyTo, onStopClick, onMapClick}: Props) {
  const {
    selectedLine, filteredStops, filteredSegments, routeCoords,
    selectedStopId, layers, viewState, setViewState
  } = useMap3D(flyTo)

  const deckLayers = useDeckLayers({
    filteredSegments, filteredStops, routeCoords, selectedLine,
    selectedStopId, showStops: layers.showStops, onStopClick,
  })

  return (
    <Box className="w-full h-full relative">
      <DeckGL
        viewState={viewState}
        onViewStateChange={e => setViewState(e.viewState as any)}
        controller={{doubleClickZoom: false, touchRotate: true}}
        layers={deckLayers}
        onClick={(info) => {
          if (!info.object && onMapClick && info.coordinate)
            onMapClick(info.coordinate[1], info.coordinate[0])
        }}
        getCursor={({isHovering}) => isHovering ? 'pointer' : 'grab'}
      >
        <Map mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=TVKx5t2ulAEGzE94LfyX"
             terrain={{source: 'maptiler-terrain', exaggeration: 1.2}}>
          <BuildingsLayer/>
        </Map>
      </DeckGL>
    </Box>
  )
}