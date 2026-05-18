/*
Finalni revize - 100%
 */

import {create} from 'zustand'
import {Weather} from "../types/design"
import type {SimDisruption} from "../types/simulation"

interface SimulationState {
  isActive: boolean;
  setIsActive: (v: boolean) => void;

  weather: string;
  passengerLoad: number;

  setWeather: (w: string) => void;
  setPassengerLoad: (l: number) => void;

  metrics: {
    congestion: number;
    efficiency: number;
    delay: number;
  };
  setMetrics: (m: Partial<SimulationState['metrics']>) => void;

  disruptions: SimDisruption[];
  addDisruption: (d: Omit<SimDisruption, 'id'>) => void;
  updateDisruption: (id: string, patch: Partial<SimDisruption>) => void;
  removeDisruption: (id: string) => void;
  clearDisruptions: () => void;

  setupStep: number;
  setSetupStep: (s: number) => void;
  isMapInjectionMode: boolean;
  setMapInjectionMode: (v: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isActive: false,
  setIsActive: (v) => set({isActive: v}),

  weather: Weather[0].key,
  passengerLoad: 100,

  setWeather: (w) => set({weather: w}),
  setPassengerLoad: (l) => set({passengerLoad: l}),

  metrics: {
    congestion: 40,
    efficiency: 100,
    delay: 0,
  },
  setMetrics: (m) => set((state) => ({metrics: {...state.metrics, ...m}})),

  disruptions: [],
  addDisruption: (d) => set((state) => ({
    disruptions: [...state.disruptions, {...d, id: `sim-d-${crypto.randomUUID()}`}]
  })),
  updateDisruption: (id, patch) => set((state) => ({
    disruptions: state.disruptions.map(d => d.id === id ? {...d, ...patch} : d)
  })),
  removeDisruption: (id) => set((state) => ({disruptions: state.disruptions.filter(d => d.id !== id)})),
  clearDisruptions: () => set({disruptions: []}),

  setupStep: 0,
  setSetupStep: (s) => set({setupStep: s}),
  isMapInjectionMode: false,
  setMapInjectionMode: (v) => set({isMapInjectionMode: v}),
}))