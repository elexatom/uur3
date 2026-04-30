/*
Finalni revize - 100% bohuzel
 */

import {useMemo} from 'react'
import {PathLayer, ScatterplotLayer} from '@deck.gl/layers'
import {TYPE_COLORS} from '../types/design'
import {hexToRgb, typeColor} from './mapUtils'
import type {Line, Segment, Stop} from '../types/transit'

type Color = [number, number, number, number]

const segmentDefaultColor = (seg: Segment): Color =>
  typeColor(seg.isTram ? 'tram' : seg.isTrol ? 'trolley' : 'bus', 180) as Color

interface RoutePathData {
  path: [number, number][]
}

interface Params {
  filteredSegments: Segment[]
  filteredStops: Stop[]
  routeCoords: [number, number][] | null
  selectedLine: Line | null // Odstraněno `any`
  selectedStopId: number | null
  showStops: boolean
  onStopClick: (stop: Stop) => void
}

export const useDeckLayers = ({
                                filteredSegments,
                                filteredStops,
                                routeCoords,
                                selectedLine,
                                selectedStopId,
                                showStops,
                                onStopClick
                              }: Params) =>
  useMemo(() => {
    const lineRgb = selectedLine ? (hexToRgb(TYPE_COLORS[selectedLine.type]) as Color) : undefined
    const dimColor: Color = [203, 213, 225, 100]

    return [
      new PathLayer<Segment>({
        id: 'segments',
        data: filteredSegments,
        getPath: (d) => d.coords.map(([lat, lng]) => [lng, lat] as [number, number]),
        getColor: (d) => selectedLine ? dimColor : segmentDefaultColor(d),
        getWidth: (d) => d.isTram ? 4 : 3,
        widthMinPixels: 2,
        pickable: false,
      }),

      selectedLine && routeCoords && lineRgb && new PathLayer<RoutePathData>({
        id: 'line-glow',
        data: [{path: routeCoords}],
        getPath: (d) => d.path,
        getColor: [lineRgb[0], lineRgb[1], lineRgb[2], 50] as Color,
        getWidth: 20,
        widthMinPixels: 15,
      }),

      selectedLine && routeCoords && lineRgb && new PathLayer<RoutePathData>({
        id: 'line-core',
        data: [{path: routeCoords}],
        getPath: (d) => d.path,
        getColor: lineRgb,
        getWidth: 6,
        widthMinPixels: 4,
      }),

      (showStops || selectedLine) && new ScatterplotLayer<Stop>({
        id: 'stops',
        data: filteredStops,
        getPosition: (d) => [d.lng, d.lat, 2] as [number, number, number],
        getRadius: (d) => (d.id === selectedStopId || selectedLine ? 15 : 10),
        getFillColor: (d) => selectedLine ? ([255, 255, 255, 255] as Color) : (typeColor(d.type) as Color),
        getLineColor: (): Color => (selectedLine && lineRgb ? lineRgb : [255, 255, 255, 255]),
        lineWidthMinPixels: 2,
        stroked: true,
        pickable: true,
        onClick: (info) => {
          if (info.object) onStopClick(info.object)
        },
      }),
    ].filter(Boolean)
  }, [filteredSegments, filteredStops, routeCoords, selectedLine, showStops, selectedStopId, onStopClick])