import { create } from 'zustand';

export type WeatherType = 'Clear' | 'Rain' | 'Snow' | 'Storm' | 'Fog' | 'Heatwave';
export type SeverityType = 'Low' | 'Medium' | 'High' | 'Critical';

export interface SimDisruption {
  id: string;
  lat: number;
  lng: number;
  label: string;
  severity: SeverityType;
  radius: number;
}

interface SimulationState {
  // Global Toggle
  isActive: boolean;
  setIsActive: (v: boolean) => void;

  // Configuration
  weather: WeatherType;
  passengerLoad: number; // 0-200%
  
  setWeather: (w: WeatherType) => void;
  setPassengerLoad: (l: number) => void;

  // Real-time Metrics
  metrics: {
    congestion: number;
    efficiency: number;
    delay: number;
    activeFleet: number;
  };
  setMetrics: (m: Partial<SimulationState['metrics']>) => void;

  // Event Injections
  disruptions: SimDisruption[];
  addDisruption: (d: SimDisruption) => void;
  updateDisruption: (id: string, patch: Partial<SimDisruption>) => void;
  removeDisruption: (id: string) => void;
  clearDisruptions: () => void;

  // UI State
  setupStep: number;
  setSetupStep: (s: number) => void;
  isMapInjectionMode: boolean;
  setMapInjectionMode: (v: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isActive: false,
  setIsActive: (v) => set({ isActive: v }),

  weather: 'Clear',
  passengerLoad: 100,

  setWeather: (w) => set({ weather: w }),
  setPassengerLoad: (l) => set({ passengerLoad: l }),

  metrics: {
    congestion: 40,
    efficiency: 100,
    delay: 0,
    activeFleet: 400,
  },
  setMetrics: (m) => set((state) => ({ metrics: { ...state.metrics, ...m } })),

  disruptions: [],
  addDisruption: (d) => set((state) => ({ disruptions: [...state.disruptions, d] })),
  updateDisruption: (id, patch) => set((state) => ({
    disruptions: state.disruptions.map(d => d.id === id ? { ...d, ...patch } : d)
  })),
  removeDisruption: (id) => set((state) => ({ disruptions: state.disruptions.filter(d => d.id !== id) })),
  clearDisruptions: () => set({ disruptions: [] }),

  setupStep: 0,
  setSetupStep: (s) => set({ setupStep: s }),
  isMapInjectionMode: false,
  setMapInjectionMode: (v) => set({ isMapInjectionMode: v }),
}));
