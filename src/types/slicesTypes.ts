/*
Finalni revize - 100%
 */

import type {MapLayers, NetworkData} from "./network.ts"
import type {AppSettings, RouteConfig, Stop} from "./transit.ts"

export interface AuthSlice {
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
}

export interface MapSlice {
  activeView: string;
  setActiveView: (view: string) => void;
  mapMode: '2d' | '3d';
  setMapMode: (mode: '2d' | '3d') => void;
  mapCenter: [number, number];
  mapZoom: number;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  layers: MapLayers;
  toggleLayer: (layer: keyof MapLayers) => void;
  selectedStopId: number | null;
  selectStop: (id: number | null) => void;
  selectedLineId: string | null;
  selectLine: (id: string | null) => void;
}

export interface NetworkSlice {
  network: NetworkData;
  fetchNetworkData: () => Promise<void>;
}

export interface EditorSlice {
  routeConfig: RouteConfig;
  setRouteName: (name: string) => void;
  setRouteType: (type: RouteConfig["type"]) => void;
  setWaypoints: (waypoints: Stop[]) => void;
  addWaypoint: (wp: Stop) => void;
  removeWaypoint: (id: number) => void;
  clearRoute: () => void;
  saveRouteToNetwork: () => void;
}

export interface SettingsSlice {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

export type AppState = AuthSlice & MapSlice & NetworkSlice & EditorSlice & SettingsSlice;
