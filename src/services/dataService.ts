import type {Line, Stop} from "../types/transit.ts"


export interface Segment {
  id: string;
  coords: [number, number][];
  isTram: boolean;
  isBus: boolean;
  isTrol: boolean;
}

export interface NetworkData {
  stops: Stop[];
  segments: Segment[];
  lines: Line[];
}

function polygonCentroid(coords: number[][][]): [number, number] {
  if (!coords || coords.length === 0 || coords[0].length === 0) return [0, 0]
  const ring = coords[0]
  let lat = 0, lng = 0
  for (const [lo, la] of ring) {
    lat += la
    lng += lo
  }
  return [lat / ring.length, lng / ring.length]
}

export async function loadNetworkData(): Promise<NetworkData> {
  try {
    const [stopsJson, segsJson, schedJson] = await Promise.all([
      fetch('/data/mhdzastavky.geojson').then((r) => r.json()).catch(() => ({features: []})),
      fetch('/data/mhduseky.geojson').then((r) => r.json()).catch(() => ({features: []})),
      fetch('/data/schedules.json').then((r) => r.json()).catch(() => ({lines: []})),
    ])

    const stops: Stop[] = []
    for (const f of stopsJson.features) {
      if (!f.geometry) continue

      let lat: number | undefined
      let lng: number | undefined
      let c: any = null

      // Handle GeoJSON types
      if (f.geometry.type === 'GeometryCollection') {
        const poly = f.geometry.geometries?.find((g: any) => g.type === 'Polygon')
        const pt = f.geometry.geometries?.find((g: any) => g.type === 'Point')

        if (poly && poly.coordinates) {
          [lat, lng] = polygonCentroid(poly.coordinates)
        } else if (pt && pt.coordinates) {
          c = pt.coordinates
        }
      } else if (f.geometry.type === 'Polygon') {
        [lat, lng] = polygonCentroid(f.geometry.coordinates)
      } else if (f.geometry.type === 'Point') {
        c = f.geometry.coordinates
      }

      if (lat === undefined || lng === undefined) {
        if (c && c.length >= 2) {
          lng = Array.isArray(c[0]) ? c[Math.floor(c.length / 2)][0] : c[0]
          lat = Array.isArray(c[0]) ? c[Math.floor(c.length / 2)][1] : c[1]
        } else {
          continue // Skip feature if parsing coordinates completely fails
        }
      }

      const p = f.properties || {}
      let type: 'tram' | 'bus' | 'trolley' = 'bus'
      if (p.TYP === 'ZT') type = 'tram'
      else if (p.TYP === 'TR') type = 'trolley'

      stops.push({id: p.ID_ZAST, name: p.NAZEV || 'Unknown', lat: lat!, lng: lng!, type})
    }
    console.log("stops", stops)

    const segments: Segment[] = []
    for (const f of segsJson.features) {
      if (f.geometry?.type !== 'LineString') continue
      // Reverse [lng, lat] to [lat, lng] for Leaflet paths
      const coords: [number, number][] = (f.geometry.coordinates || []).map(([lo, la]: number[]) => [la, lo])
      const p = f.properties || {}
      segments.push({id: f.id || `s${Math.random()}`, coords, isTram: !!p.TRAM, isBus: !!p.BUS, isTrol: !!p.TROL})
    }

    const lines: Line[] = schedJson.lines || []

    return {stops, segments, lines}
  } catch (error) {
    console.error("Failed to load network data:", error)
    return {stops: [], segments: [], lines: []}
  }
}
