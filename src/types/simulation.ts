/*
Finalni revize - 100%
 */

export interface SimDisruption {
  id: string
  lat: number
  lng: number
  label: string
  severity: 0 | 1 | 2 | 3
  severityLabel: string
  radius: number
}