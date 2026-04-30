/*
Finalni revize - 100%
 */

import {Layer as MaplibreLayer, Source} from 'react-map-gl/maplibre'

export const BuildingsLayer = () => (
  <>
    <Source id="maptiler-terrain" type="raster-dem"
            url="https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=TVKx5t2ulAEGzE94LfyX"
            tileSize={512}
    />

    <MaplibreLayer
      id="3d-buildings"
      source="openmaptiles"
      source-layer="building"
      type="fill-extrusion" minzoom={14}
      paint={{
        'fill-extrusion-color': '#f1f5f9',
        'fill-extrusion-height': ['get', 'render_height'],
        'fill-extrusion-base': ['get', 'render_min_height'],
        'fill-extrusion-opacity': 0.6,
      }}
    />

  </>
)