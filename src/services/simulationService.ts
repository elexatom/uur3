// revidovano OK

import type { SimDisruption } from "../types/simulation.ts"
import { Weather } from "../types/design"

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (x: number) => x * Math.PI / 180
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const severityImpact: Record<number, number> = { 0: 1, 1: 3, 2: 8, 3: 20 }

const noise = () => (Math.random() - 0.5) * 1.5

export const calculateNextMetrics = (
  current: { congestion: number; efficiency: number; delay: number; },
  config: { weather: string; passengerLoad: number; disruptions: SimDisruption[] }
) => {
  const { weather, passengerLoad, disruptions } = config
  const weatherSeverity = (Weather.find(w => w.key === weather) ?? Weather[0]).severity

  let congestionTrend = (passengerLoad - 100) / 20 + weatherSeverity
  let efficiencyTrend = 0
  let delayTrend = weatherSeverity * 0.1

  disruptions.forEach(({ severity }) => {
    const mult = severityImpact[severity] ?? 0
    congestionTrend += mult * 0.2
    delayTrend += mult * 0.05
    efficiencyTrend -= mult * 0.1
  })

  return {
    congestion: Math.min(100, Math.max(10, current.congestion + congestionTrend * 0.1 + noise())),
    efficiency: Math.min(100, Math.max(5, current.efficiency + efficiencyTrend * 0.1 + noise() * 0.2)),
    delay: Math.max(0, current.delay + delayTrend * 0.1 + (Math.random() > 0.9 ? 1 : 0)),
  }
}

export const calculateSegmentCongestion = (
  lat: number, lng: number, baseCongestion: number, disruptions: SimDisruption[]
) => {
  const impact = disruptions.reduce((acc, d) => {
    const dist = getDistance(lat, lng, d.lat, d.lng)
    const radiusKm = d.radius / 1000
    if (dist >= radiusKm * 3) return acc
    return acc + (severityImpact[d.severity] ?? 0) * 4 * Math.max(0, 1 - dist / (radiusKm * 3))
  }, baseCongestion)
  return Math.min(100, impact)
}

export const estimateStopDelay = (
  lat: number, lng: number, globalDelay: number, disruptions: SimDisruption[]
) => {
  const impact = disruptions.reduce((acc, d) => {
    const dist = getDistance(lat, lng, d.lat, d.lng)
    const radiusKm = d.radius / 1000
    if (dist >= radiusKm * 2) return acc
    return acc + (severityImpact[d.severity] ?? 0) * 2 * (1 - dist / (radiusKm * 2))
  }, globalDelay)
  return Math.round(impact)
}

export const getTrafficColor = (value: number) => {
  const hue = value < 45 ? 120 : Math.max(0, Math.min(120, ((100 - value) / 55) * 120))
  return `hsl(${hue}, 85%, 50%)`
}