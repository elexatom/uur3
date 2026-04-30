/*
Finalni revize - 100%
 */

import type {StateCreator} from "zustand"
import type {AppState, AuthSlice, EditorSlice, MapSlice, NetworkSlice, SettingsSlice} from "../types/slicesTypes.ts"
import {loadNetworkData} from "../services/dataService.ts"
import type {AppSettings, Line, Stop} from "../types/transit.ts"

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  setAuthenticated: (v) => set({isAuthenticated: v}),
})

export const createMapSlice: StateCreator<AppState, [], [], MapSlice> = (set) => ({
  activeView: "network",
  setActiveView: (view) => set({activeView: view}),

  mapMode: '2d',
  setMapMode: (mode) => set({mapMode: mode}),
  mapCenter: [49.7437, 13.3736],
  mapZoom: 12,
  setMapCenter: (center, zoom) => set({mapCenter: center, ...(zoom !== undefined ? {mapZoom: zoom} : {})}),

  layers: {showTrams: true, showBuses: true, showTrolleys: true, showStops: true, showHeatmap: false},
  toggleLayer: (layer) => set((s) => ({layers: {...s.layers, [layer]: !s.layers[layer]}})),

  selectedStopId: null,
  selectStop: (id) => set({selectedStopId: id}),
  selectedLineId: null,
  selectLine: (id) => set({selectedLineId: id}),
})

export const createNetworkSlice: StateCreator<AppState, [], [], NetworkSlice> = (set, get) => ({
  network: {stops: [], segments: [], lines: [], isLoading: false, error: null},

  fetchNetworkData: async () => {
    if (get().network.stops.length > 0) return
    set((s) => ({network: {...s.network, isLoading: true}}))
    try {
      const data = await loadNetworkData()
      set({network: {...data, isLoading: false, error: null}})
    } catch {
      set((s) => ({network: {...s.network, isLoading: false, error: "Failed to load network"}}))
    }
  },
})

export const createEditorSlice: StateCreator<AppState, [], [], EditorSlice> = (set, get) => ({
  routeConfig: {name: "", type: "tram", waypoints: []},
  setRouteName: (name) => set((s) => ({routeConfig: {...s.routeConfig, name}})),
  setRouteType: (type) => set((s) => ({routeConfig: {...s.routeConfig, type}})),
  setWaypoints: (waypoints) => set((s) => ({routeConfig: {...s.routeConfig, waypoints}})),
  addWaypoint: (wp) => set((s) => ({routeConfig: {...s.routeConfig, waypoints: [...s.routeConfig.waypoints, wp]}})),
  removeWaypoint: (id) => set((s) => ({
    routeConfig: {...s.routeConfig, waypoints: s.routeConfig.waypoints.filter((w) => w.id !== id)}
  })),
  clearRoute: () => set((s) => ({routeConfig: {...s.routeConfig, waypoints: [], name: ""}})),

  saveRouteToNetwork: () => {
    const {routeConfig, network, clearRoute} = get()
    if (!routeConfig.name || routeConfig.waypoints.length === 0) return

    const newStops: Stop[] = routeConfig.waypoints.map((wp, i) => ({
      id: Date.now() + i,
      name: wp.name || `Zastávka ${routeConfig.name} - ${i + 1}`,
      lat: wp.lat, lng: wp.lng, type: routeConfig.type,
    }))

    const newLine: Line = {
      id: `line-${Date.now()}`,
      number: routeConfig.name.substring(0, 3).toUpperCase(),
      name: routeConfig.name,
      type: routeConfig.type,
      longName: routeConfig.name,
      stopIds: newStops.map(s => s.id),
    }

    set({network: {...network, stops: [...network.stops, ...newStops], lines: [...network.lines, newLine]}})
    clearRoute()
  },
})

const DEFAULT_SETTINGS: AppSettings = {
  osrmEndpoint: "https://router.project-osrm.org/route/v1/driving",
  basemapLayers: [
    {
      id: "carto-light",
      name: "Světlý podklad",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CARTO"
    },
    {
      id: "carto-dark",
      name: "Tmavý podklad",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CARTO"
    },
  ],
  activeBasemapId: "carto-light",
}

export const normalizeSettings = (settings: AppSettings): AppSettings => {
  const basemapLayers = settings.basemapLayers?.length > 0 ? settings.basemapLayers : DEFAULT_SETTINGS.basemapLayers
  const hasActiveLayer = basemapLayers.some((layer) => layer.id === settings.activeBasemapId)
  return {...settings, basemapLayers, activeBasemapId: hasActiveLayer ? settings.activeBasemapId : basemapLayers[0].id}
}

export const createSettingsSlice: StateCreator<AppState, [], [], SettingsSlice> = (set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (s) => set((state) => ({settings: normalizeSettings({...state.settings, ...s})})),
})
