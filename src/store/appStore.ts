import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppSettings, Disruption, Line, RouteConfig, Stop } from "../types/transit"
import { loadNetworkData, type Segment } from "../services/dataService"

interface MapLayers {
  showTrams: boolean;
  showBuses: boolean;
  showTrolleys: boolean;
  showStops: boolean;
  showHeatmap: boolean;
}

interface NetworkData {
  stops: Stop[];
  segments: Segment[];
  lines: Line[];
  isLoading: boolean;
  error: string | null;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

interface AppState {
  // Theme
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleDarkMode: () => void;
  setColors: (colors: Partial<ThemeColors>) => void;

  // Navigation
  activeView: string;
  setActiveView: (view: string) => void;

  // Map
  selectedStopId: number | null;
  selectedLineId: string | null;
  mapCenter: [number, number];
  mapZoom: number;
  layers: MapLayers;
  selectStop: (id: number | null) => void;
  selectLine: (id: string | null) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  toggleLayer: (layer: keyof MapLayers) => void;

  // Network Data
  network: NetworkData;
  fetchNetworkData: () => Promise<void>;

  // Disruptions
  disruptions: Disruption[];
  addDisruption: (d: Disruption) => void;
  removeDisruption: (id: string) => void;
  toggleDisruption: (id: string) => void;

  // Route Editor
  routeConfig: RouteConfig;
  setRouteName: (name: string) => void;
  setRouteType: (type: RouteConfig["type"]) => void;
  setWaypoints: (waypoints: Stop[]) => void;
  addWaypoint: (wp: Stop) => void;
  removeWaypoint: (id: number) => void;
  clearRoute: () => void;
  saveRouteToNetwork: () => void;

  // Simulation
  simulationActive: boolean;
  simulationDelay: number;
  setSimulationActive: (v: boolean) => void;
  setSimulationDelay: (d: number) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;

  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
}

const DEFAULT_COLORS: ThemeColors = {
  primary: "#10a4ff",
  secondary: "#2578d1",
  tertiary: "#8264ce",
}

const DEFAULT_SETTINGS: AppSettings = {
  osrmEndpoint: "https://router.project-osrm.org/route/v1/driving",
  osrmTimeout: 500,
  maxWaypoints: 25,
  retryLogic: true,
  showHeatmap: true,
  show3dTerrain: false,
  showStopDensity: true,
  criticalDelayMin: 12,
  networkOverloadPct: 85,
  basemapLayers: [
    {
      id: "carto-light",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    },
    {
      id: "carto-dark",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    },
    {
      id: "osm-standard",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
  ],
  activeBasemapId: "carto-light",
}

const normalizeSettings = (settings: AppSettings): AppSettings => {
  const basemapLayers = settings.basemapLayers.length > 0
    ? settings.basemapLayers
    : DEFAULT_SETTINGS.basemapLayers

  const hasActiveLayer = basemapLayers.some((layer) => layer.id === settings.activeBasemapId)

  return {
    ...settings,
    basemapLayers,
    activeBasemapId: hasActiveLayer ? settings.activeBasemapId : basemapLayers[0].id,
  }
}

const applyColorsToDOM = (colors: ThemeColors) => {
  const root = document.documentElement
  root.style.setProperty("--color-primary", colors.primary)
  root.style.setProperty("--color-primary-dim", colors.primary)
  root.style.setProperty("--color-secondary", colors.secondary)
  root.style.setProperty("--color-tertiary", colors.tertiary)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: false,
      colors: DEFAULT_COLORS,
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      setColors: (colors) => {
        const next = { ...get().colors, ...colors }
        applyColorsToDOM(next)
        set({ colors: next })
      },

      // Navigation
      activeView: "network",
      setActiveView: (view) => set({ activeView: view }),

      // Map
      selectedStopId: null,
      selectedLineId: null,
      mapCenter: [49.7437, 13.3736],
      mapZoom: 12,
      layers: {
        showTrams: true,
        showBuses: true,
        showTrolleys: true,
        showStops: true,
        showHeatmap: false,
      },
      selectStop: (id) => set({ selectedStopId: id }),
      selectLine: (id) => set({ selectedLineId: id }),
      setMapCenter: (center, zoom) =>
        set({ mapCenter: center, ...(zoom !== undefined ? { mapZoom: zoom } : {}) }),
      toggleLayer: (layer) =>
        set((s) => ({ layers: { ...s.layers, [layer]: !s.layers[layer] } })),

      // Network Data
      network: {
        stops: [],
        segments: [],
        lines: [],
        isLoading: false,
        error: null,
      },
      fetchNetworkData: async () => {
        if (get().network.stops.length > 0) return // Already loaded
        set((s) => ({ network: { ...s.network, isLoading: true } }))
        try {
          const data = await loadNetworkData()
          set({ network: { ...data, isLoading: false, error: null } })
        } catch {
          set((s) => ({ network: { ...s.network, isLoading: false, error: "Failed to load network" } }))
        }
      },

      // Disruptions
      disruptions: [],
      addDisruption: (d) => set((s) => ({ disruptions: [...s.disruptions, d] })),
      removeDisruption: (id) =>
        set((s) => ({ disruptions: s.disruptions.filter((d) => d.id !== id) })),
      toggleDisruption: (id) =>
        set((s) => ({
          disruptions: s.disruptions.map((d) =>
            d.id === id ? { ...d, active: !d.active } : d
          ),
        })),

      // Route Editor
      routeConfig: {
        name: "",
        type: "tram",
        waypoints: [],
        peakFreqMin: 8,
        offPeakFreqMin: 15,
      },
      setRouteName: (name) =>
        set((s) => ({ routeConfig: { ...s.routeConfig, name } })),
      setRouteType: (type) =>
        set((s) => ({ routeConfig: { ...s.routeConfig, type } })),
      setWaypoints: (waypoints) =>
        set((s) => ({ routeConfig: { ...s.routeConfig, waypoints } })),
      addWaypoint: (wp) =>
        set((s) => ({
          routeConfig: {
            ...s.routeConfig,
            waypoints: [...s.routeConfig.waypoints, wp],
          },
        })),
      removeWaypoint: (id) =>
        set((s) => ({
          routeConfig: {
            ...s.routeConfig,
            waypoints: s.routeConfig.waypoints.filter((w) => w.id !== id),
          },
        })),
      clearRoute: () =>
        set((s) => ({
          routeConfig: { ...s.routeConfig, waypoints: [], name: "" },
        })),
      saveRouteToNetwork: () => {
        const { routeConfig, network } = get()
        if (!routeConfig.name || routeConfig.waypoints.length === 0) return

        // Convert waypoints to stops
        const newStops: Stop[] = routeConfig.waypoints.map((wp, i) => ({
          id: Date.now() + i,
          name: wp.name || `Stop ${routeConfig.name} - ${i + 1}`,
          lat: wp.lat,
          lng: wp.lng,
          type: routeConfig.type,
        }))

        const newLine: Line = {
          id: `line-${Date.now()}`,
          number: routeConfig.name.substring(0, 3).toUpperCase(),
          name: routeConfig.name,
          type: routeConfig.type,
          color: routeConfig.type === "tram" ? "#fb8a00" : routeConfig.type === "bus" ? "#10a4ff" : "#22c55e",
          stopIds: newStops.map(s => s.id),
        }

        set({
          network: {
            ...network,
            stops: [...network.stops, ...newStops],
            lines: [...network.lines, newLine],
          },
        })
        get().clearRoute()
      },

      // Simulation
      simulationActive: false,
      simulationDelay: 14,
      setSimulationActive: (v) => set({ simulationActive: v }),
      setSimulationDelay: (d) => set({ simulationDelay: d }),

      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (s) =>
        set((state) => ({ settings: normalizeSettings({ ...state.settings, ...s }) })),

      // Auth
      isAuthenticated: false,
      setAuthenticated: (v) => set({ isAuthenticated: v }),
    }),
    {
      name: "pilsen-pulse-store",
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        colors: state.colors,
        layers: state.layers,
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<AppState>) ?? {}
        const persistedSettings = persisted.settings

        return {
          ...currentState,
          ...persisted,
          settings: persistedSettings
            ? normalizeSettings({ ...currentState.settings, ...persistedSettings })
            : currentState.settings,
        }
      },
      onRehydrateStorage: () => (state) => {
        if (state) applyColorsToDOM(state.colors)
      },
    }
  )
)
