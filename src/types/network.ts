/*
Finalni revize - 100%
 */

import type {Line, Segment, Stop} from "./transit.ts"

export interface MapLayers {
  showTrams: boolean;
  showBuses: boolean;
  showTrolleys: boolean;
  showStops: boolean;
  showHeatmap: boolean;
}

export interface NetworkData {
  stops: Stop[];
  segments: Segment[];
  lines: Line[];
  isLoading: boolean;
  error: string | null;
}

export interface FormatedFeature {
  id: string;
  main: string;
  detail: string;
  lon: string;
  lat: string;
}