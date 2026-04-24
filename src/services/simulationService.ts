import type { WeatherType, SeverityType, SimDisruption } from '../store/simulationStore';

// Distance calculation between two points (in km)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const severityImpact: Record<SeverityType, number> = {
  Low: 1,
  Medium: 3,
  High: 8,
  Critical: 20,
};

export const calculateNextMetrics = (
  current: { congestion: number; efficiency: number; delay: number; activeFleet: number },
  config: { weather: WeatherType; passengerLoad: number; disruptions: SimDisruption[] }
) => {
  const { weather, passengerLoad, disruptions } = config;

  // Base factors
  let congestionTrend = (passengerLoad - 100) / 20; 
  let efficiencyTrend = 0;
  let delayTrend = 0;

  // Weather impact
  const weatherImpact: Record<WeatherType, number> = {
    Clear: 0, Rain: 0.5, Snow: 1.2, Storm: 2.5, Fog: 0.8, Heatwave: 0.3,
  };
  congestionTrend += weatherImpact[weather];
  delayTrend += weatherImpact[weather] * 0.1;

  // Global disruptions impact (summed)
  disruptions.forEach(d => {
    const mult = severityImpact[d.severity];
    congestionTrend += mult * 0.2;
    delayTrend += mult * 0.05;
    efficiencyTrend -= mult * 0.1;
  });

  const noise = () => (Math.random() - 0.5) * 1.5;

  return {
    congestion: Math.min(100, Math.max(10, current.congestion + (congestionTrend * 0.1) + noise())),
    efficiency: Math.min(100, Math.max(5, current.efficiency + (efficiencyTrend * 0.1) + noise() * 0.2)),
    delay: Math.max(0, current.delay + (delayTrend * 0.1) + (Math.random() > 0.9 ? 1 : 0)),
    activeFleet: current.activeFleet,
  };
};

export const calculateSegmentCongestion = (
  segmentLat: number, 
  segmentLng: number, 
  baseCongestion: number, 
  disruptions: SimDisruption[]
) => {
  let impact = baseCongestion;

  disruptions.forEach(d => {
    const dist = getDistance(segmentLat, segmentLng, d.lat, d.lng);
    const radiusKm = d.radius / 1000;
    
    if (dist < radiusKm * 3) {
      const distanceFactor = Math.max(0, 1 - (dist / (radiusKm * 3)));
      const severityFactor = severityImpact[d.severity] * 4;
      impact += severityFactor * distanceFactor;
    }
  });

  return Math.min(100, impact);
};

export const estimateStopDelay = (
  stopLat: number,
  stopLng: number,
  globalDelay: number,
  disruptions: SimDisruption[]
) => {
  let localImpact = globalDelay;
  
  disruptions.forEach(d => {
    const dist = getDistance(stopLat, stopLng, d.lat, d.lng);
    const radiusKm = d.radius / 1000;
    if (dist < radiusKm * 2) {
      const distFactor = 1 - (dist / (radiusKm * 2));
      localImpact += severityImpact[d.severity] * 2 * distFactor;
    }
  });
  
  return Math.round(localImpact);
};

export const getTrafficColor = (value: number) => {
  const hue = Math.max(0, Math.min(120, (1 - value / 100) * 120)).toString(10);
  return `hsl(${hue}, 85%, 50%)`;
};
