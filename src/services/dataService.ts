/*
Finalni revize - 100%
 */

import type {Line, Segment, Stop} from "../types/transit.ts"
import type {NetworkData} from "../types/network.ts"

export async function loadNetworkData(): Promise<NetworkData> {
  try {
    const [usekyRes, graphRes] = await Promise.all([
      fetch('/data/mhduseky.geojson'),
      fetch('/data/transit_graph.json')
    ])

    const usekyData = await usekyRes.json()
    const graphData = await graphRes.json()

    const mappedStops: Stop[] = (graphData.stops || []).map((s: any) => {
      let type: 'tram' | 'bus' | 'trolley' = 'bus'
      const t = String(s.typ || s.type).toUpperCase()
      if (t === 'ZT' || t === 'ZTA' || t === 'TRAM') type = 'tram'
      else if (t === 'ZE' || t === 'TR' || t === 'TROLLEY' || t === 'TROL') type = 'trolley'

      return {
        ...s,
        lng: s.lon || s.lng,
        type,
        gpsId: s.id_pmdp || s.gpsId,
        id: s.id
      }
    })

    const mappedSegments: Segment[] = (usekyData.features || []).map((f: any) => {
      const coords = f.geometry?.coordinates?.map(([lon, lat]: number[]) => [lat, lon]) || []
      const p = f.properties || {}
      return {
        id: f.id || `seg-${Math.random()}`,
        coords,
        isTram: !!p.TRAM,
        isBus: !!p.BUS,
        isTrol: !!p.TROL || !!p.TROLLEY
      }
    })

    const mappedLines: Line[] = (graphData.routes || []).map((r: any) => ({
      ...r,
      id: r.id || r.route_id,
      number: r.number || r.name,
      type: r.type === 'trol' ? 'trolley' : r.type, // sjednoceni nazvu
      geometry: r.geometry // OSRM geometrie
    }))

    return {stops: mappedStops, segments: mappedSegments, lines: mappedLines, isLoading: false, error: null}
  } catch (error) {
    console.error("Chyba při načítání dat:", error)
    return {stops: [], segments: [], lines: [], isLoading: false, error: "Failed to load network data"}
  }
}
