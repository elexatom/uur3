/*
Finalni revize - 100%
 */

import TramIcon from "@mui/icons-material/Tram"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt"
import React from "react"
import L from "leaflet"

export const TYPE_ICONS: Record<string, React.ReactNode> = {
  tram: <TramIcon sx={{fontSize: 16}}/>,
  bus: <DirectionsBusIcon sx={{fontSize: 16}}/>,
  trolley: <ElectricBoltIcon sx={{fontSize: 16}}/>,
}

export const TYPE_LABELS: Record<string, string> = {
  tram: "Tramvaje",
  bus: "Autobusy",
  trolley: "Trolejbusy",
}

export const TYPE_COLORS: Record<string, string> = {
  tram: "#fb8a00",
  bus: "#10a4ff",
  trolley: "#22c55e",
}

export const LAYER_CFG = [
  {key: "showTrams", label: "Tramvaje", bg: "bg-[#fb8a00]"},
  {key: "showBuses", label: "Autobusy", bg: "bg-[#10a4ff]"},
  {key: "showTrolleys", label: "Trolejbusy", bg: "bg-[#22c55e]"},
  {key: "showStops", label: "Zobrazit zastávky", bg: "bg-purple-500"},
] as const

export const createWaypointIcon = (color: string, index: number): L.DivIcon => {
  return L.divIcon({
    html: `<div style="width:24px;height:24px;border-radius:50%;background:white;border:3px solid ${color};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:${color};box-shadow:0 2px 4px rgba(0,0,0,0.1)">${index}</div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

export const SEVERITY_CONFIG = {
  0: {label: 'Nízká', color: '#22c55e'},
  1: {label: 'Střední', color: '#eab308'},
  2: {label: 'Vysoká', color: '#fb8a00'},
  3: {label: 'Kritická', color: '#ef4444'},
} as const

export const Weather = [
  {key: "weather0", label: "Jasno", severity: 0},
  {key: "weather1", label: "Déšť", severity: 1},
  {key: "weather2", label: "Sníh", severity: 1.2},
  {key: "weather3", label: "Mlha", severity: 2.5},
  {key: "weather4", label: "Bouřka", severity: 1.8},
] as const