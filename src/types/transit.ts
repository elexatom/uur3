/*
Finalni revize - 100%
 */

export type TransitType = 'tram' | 'bus' | 'trolley';

export interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  gpsId?: string;
  type: TransitType;
}

export interface Line {
  id: string;
  number: string;
  name: string;
  longName: string;
  type: TransitType;
  stopIds: number[];
  stops?: string[];
  geometry?: {
    type: string;
    coordinates: [number, number][];
  };
}

export interface RouteConfig {
  name: string;
  type: TransitType;
  waypoints: Stop[];
}

export interface Segment {
  id: string;
  coords: [number, number][];
  isTram: boolean;
  isBus: boolean;
  isTrol: boolean;
}

export interface FleetUnit {
  id: string;
  line: string;
  currentStation: string;
  maintenanceStatus: string;
}

export interface AppSettings {
  osrmEndpoint: string;
  basemapLayers: BasemapLayerConfig[];
  activeBasemapId: string;
}

export interface BasemapLayerConfig {
  id: string;
  url: string;
  attribution: string;
  name: string;
}
