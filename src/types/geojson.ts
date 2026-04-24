// GeoJSON feature types from Plzeň MHD data

export interface StopProperties {
  OBJEKT: string;
  ID_ZAST: number;
  ID_PMDP_GPS: string;
  NAZEV: string;
  TYP: string; // 'ZA' = zastávka
}

export interface RouteSegmentProperties {
  ID_USEK: string;
  BUS: number;   // 0 or 1
  TRAM: number;  // 0 or 1
  TROL: number;  // 0 or 1
  NOC: number;   // night service
  ZOO: number;
}

export interface SignpostProperties {
  OBJEKT: string;
  ID_OZN: number;
  ID_ZAST: number;
  TYP: string;
  INFO: string;
}

export type TransitType = 'tram' | 'bus' | 'trolley';

export interface GeoFeature<Props, Geom = GeoJSON.Geometry> {
  type: 'Feature';
  id: string;
  geometry: Geom;
  properties: Props;
}

export interface GeoFeatureCollection<Props> {
  type: 'FeatureCollection';
  features: GeoFeature<Props>[];
}
