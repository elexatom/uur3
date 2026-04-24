// rev begin
export type TransitType = 'tram' | 'bus' | 'trolley';
export type VehicleStatus = 'on-time' | 'delayed' | 'alert' | 'scheduled';
export type MaintenanceStatus = 'optimal' | 'service-required' | 'scheduled';
export type DisruptionLevel = 1 | 2 | 3 | 4 | 5;

export interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: TransitType;
}

export interface Line {
  id: string;
  number: string;
  name: string;
  type: TransitType;
  color: string;
  stopIds: number[];
  stops?: string[]; // Optional array of stop names from schedules.json
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

//rev end


export interface FleetUnit {
  id: string;
  line: string;
  destination: string;
  type: TransitType;
  vehicleType: string; // 'Articulated Tram', 'EV-Single', etc.
  currentStation: string;
  scheduledTime: string;
  actualTime: string;
  status: VehicleStatus;
  delayMinutes: number;
  chargeFuel: number; // 0-100
  latencyMs: number;
  maintenanceStatus: MaintenanceStatus;
  lat: number;
  lng: number;
}

export interface Disruption {
  id: string;
  title: string;
  level: DisruptionLevel;
  lat: number;
  lng: number;
  radius: number; // meters
  affectedLines: string[];
  createdAt: string;
  active: boolean;
}

export interface ScheduleEntry {
  time: string;
  stopId: number;
  lineId: string;
  direction: string;
}

export interface Timetable {
  stopId: number;
  lineId: string;
  departures: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  target: string;
  weatherSeverity: string;
  passengerLoad: number;
  activeFleet: number;
}

export interface SimulationEvent {
  time: string;
  type: 'EVENT' | 'SYSTEM' | 'INFO' | 'START' | 'WARNING';
  message: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  permissions: string[];
}

export interface AuditEntry {
  time: string;
  action: string;
  detail: string;
}

export interface AppSettings {
  osrmEndpoint: string;
  osrmTimeout: number;
  maxWaypoints: number;
  retryLogic: boolean;
  showHeatmap: boolean;
  show3dTerrain: boolean;
  showStopDensity: boolean;
  criticalDelayMin: number;
  networkOverloadPct: number;
  basemapLayers: BasemapLayerConfig[];
  activeBasemapId: string;
}

export interface BasemapLayerConfig {
  id: string;
  url: string;
  attribution: string;
}
