import type {SimDisruption} from '../types/simulation.ts'
import {Weather} from "../types/design"


// Vzdálenost mezi dvěma body v km
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371 // Poloměr Země
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// OPRAVA: Mapování číselných severity (0-3) na reálný dopad (multiplier)
export const severityImpact: Record<number, number> = {
  0: 1,  // Nízká
  1: 3,  // Střední
  2: 8,  // Vysoká
  3: 20, // Kritická
}

export const calculateNextMetrics = (
  current: { congestion: number; efficiency: number; delay: number; activeFleet: number },
  config: { weather: string; passengerLoad: number; disruptions: SimDisruption[] }
) => {
  const {weather, passengerLoad, disruptions} = config

  // Base factors
  let congestionTrend = (passengerLoad - 100) / 20
  let efficiencyTrend = 0
  let delayTrend = 0

  // Najdeme aktuální počasí v poli Weather, pokud neexistuje, použijeme default (Jasno)
  const currentWeather = Weather.find(w => w.key === weather) || Weather[0]
  const weatherSeverity = currentWeather.severity

  // Weather impact
  congestionTrend += weatherSeverity
  delayTrend += weatherSeverity * 0.1

  // Global disruptions impact (summed)
  disruptions.forEach(d => {
    // Tady už to bezpečně přečte např. severityImpact[1], což vrátí 3
    const mult = severityImpact[d.severity] || 0

    congestionTrend += mult * 0.2
    delayTrend += mult * 0.05
    efficiencyTrend -= mult * 0.1
  })

  const noise = () => (Math.random() - 0.5) * 1.5

  return {
    congestion: Math.min(100, Math.max(10, current.congestion + (congestionTrend * 0.1) + noise())),
    efficiency: Math.min(100, Math.max(5, current.efficiency + (efficiencyTrend * 0.1) + noise() * 0.2)),
    delay: Math.max(0, current.delay + (delayTrend * 0.1) + (Math.random() > 0.9 ? 1 : 0)),
    activeFleet: current.activeFleet,
  }
}

export const calculateSegmentCongestion = (
  segmentLat: number,
  segmentLng: number,
  baseCongestion: number,
  disruptions: SimDisruption[]
) => {
  let impact = baseCongestion

  disruptions.forEach(d => {
    const dist = getDistance(segmentLat, segmentLng, d.lat, d.lng)
    const radiusKm = d.radius / 1000

    if (dist < radiusKm * 3) {
      const distanceFactor = Math.max(0, 1 - (dist / (radiusKm * 3)))
      const severityFactor = (severityImpact[d.severity] || 0) * 4
      impact += severityFactor * distanceFactor
    }
  })

  return Math.min(100, impact)
}

export const estimateStopDelay = (
  stopLat: number,
  stopLng: number,
  globalDelay: number,
  disruptions: SimDisruption[]
) => {
  let localImpact = globalDelay

  disruptions.forEach(d => {
    const dist = getDistance(stopLat, stopLng, d.lat, d.lng)
    const radiusKm = d.radius / 1000
    if (dist < radiusKm * 2) {
      const distFactor = 1 - (dist / (radiusKm * 2))
      localImpact += (severityImpact[d.severity] || 0) * 2 * distFactor
    }
  })

  return Math.round(localImpact)
}

export const getTrafficColor = (value: number) => {
  const hue = value < 45 ? 120 : Math.max(0, Math.min(120, ((100 - value) / 55) * 120))
  return `hsl(${hue}, 85%, 50%)`
}
