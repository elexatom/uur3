import { create } from 'zustand';
import type { FleetUnit } from '../types/transit';

const PLZEN_CENTER: [number, number] = [49.7437, 13.3736];
const spread = (base: [number, number], spread: number): [number, number] => [
  base[0] + (Math.random() - 0.5) * spread,
  base[1] + (Math.random() - 0.5) * spread,
];

const INITIAL_FLEET: FleetUnit[] = [
  { id: 'TR-4022', line: 'Linka 2 → Bory', destination: 'Bory Terminal', type: 'tram', vehicleType: 'Kloubová tramvaj', currentStation: 'U Práce', scheduledTime: '14:22:00', actualTime: '14:26:15', status: 'delayed', delayMinutes: 4, chargeFuel: 82, latencyMs: 12, maintenanceStatus: 'optimal', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'TR-1108', line: 'Linka 4 → Světovar', destination: 'Světovar', type: 'tram', vehicleType: 'Kloubová tramvaj', currentStation: 'Náměstí Republiky', scheduledTime: '14:23:30', actualTime: '14:23:42', status: 'on-time', delayMinutes: 0, chargeFuel: 91, latencyMs: 8, maintenanceStatus: 'optimal', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'BS-990', line: 'Linka 30 → Borská Pole', destination: 'Borská Pole', type: 'bus', vehicleType: 'EV-Solo', currentStation: 'Mrakodrap', scheduledTime: '14:24:00', actualTime: '14:38:00', status: 'alert', delayMinutes: 14, chargeFuel: 14, latencyMs: 186, maintenanceStatus: 'service-required', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'TL-209', line: 'Linka 12 → Skvrňany', destination: 'Skvrňany', type: 'trolley', vehicleType: 'Trolejbus', currentStation: 'CAN', scheduledTime: '14:25:00', actualTime: '14:25:10', status: 'on-time', delayMinutes: 0, chargeFuel: 100, latencyMs: 7, maintenanceStatus: 'optimal', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'TR-3301', line: 'Linka 1 → Slovany', destination: 'Slovany', type: 'tram', vehicleType: 'Nízkopodlažní tramvaj', currentStation: 'Hlavní nádraží', scheduledTime: '14:26:00', actualTime: '14:27:30', status: 'delayed', delayMinutes: 1, chargeFuel: 76, latencyMs: 14, maintenanceStatus: 'optimal', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'BS-441', line: 'Linka 15 → Radčice', destination: 'Radčice', type: 'bus', vehicleType: 'Hybrid Double', currentStation: 'Husova', scheduledTime: '14:27:00', actualTime: '14:27:05', status: 'on-time', delayMinutes: 0, chargeFuel: 67, latencyMs: 22, maintenanceStatus: 'scheduled', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'TL-118', line: 'Linka 11 → Zátiší', destination: 'Zátiší', type: 'trolley', vehicleType: 'Trolejbus', currentStation: 'Klatovská', scheduledTime: '14:28:00', actualTime: '14:28:00', status: 'on-time', delayMinutes: 0, chargeFuel: 100, latencyMs: 9, maintenanceStatus: 'optimal', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'BS-772', line: 'Linka 40 → Plzeň-sever', destination: 'Plzeň-sever', type: 'bus', vehicleType: 'EV-Solo', currentStation: 'Štefánikovo nám.', scheduledTime: '14:29:00', actualTime: '14:29:00', status: 'on-time', delayMinutes: 0, chargeFuel: 55, latencyMs: 18, maintenanceStatus: 'optimal', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'TR-2205', line: 'Linka 2 → Bolevec', destination: 'Bolevec', type: 'tram', vehicleType: 'Kloubová tramvaj', currentStation: 'Výstaviště', scheduledTime: '14:30:00', actualTime: '14:30:00', status: 'on-time', delayMinutes: 0, chargeFuel: 88, latencyMs: 11, maintenanceStatus: 'optimal', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
  { id: 'BS-333', line: 'Linka 20 → Doubravka', destination: 'Doubravka', type: 'bus', vehicleType: 'Hybrid Double', currentStation: 'Tylova', scheduledTime: '14:31:00', actualTime: '14:36:00', status: 'delayed', delayMinutes: 5, chargeFuel: 43, latencyMs: 35, maintenanceStatus: 'service-required', lat: spread(PLZEN_CENTER, 0.04)[0], lng: spread(PLZEN_CENTER, 0.04)[1] },
];

interface FleetState {
  units: FleetUnit[];
  updateUnit: (id: string, patch: Partial<FleetUnit>) => void;
  tickLive: () => void;
}

export const useFleetStore = create<FleetState>((set, get) => ({
  units: INITIAL_FLEET,
  updateUnit: (id, patch) =>
    set((s) => ({
      units: s.units.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    })),
  tickLive: () => {
    set((s) => ({
      units: s.units.map((u) => {
        const latDelta = (Math.random() - 0.5) * 0.0008;
        const lngDelta = (Math.random() - 0.5) * 0.0008;
        const latMs = u.latencyMs + Math.round((Math.random() - 0.5) * 4);
        return {
          ...u,
          lat: u.lat + latDelta,
          lng: u.lng + lngDelta,
          latencyMs: Math.max(5, Math.min(300, latMs)),
        };
      }),
    }));

    // Simulate occasional actual time updates
    const { units } = get();
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    set((s) => ({
      units: s.units.map((u) =>
        u.id === randomUnit.id ? { ...u, actualTime: timeStr } : u
      ),
    }));
  },
}));
