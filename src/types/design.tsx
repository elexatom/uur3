// revidovano OK

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

// Konfigurace vrstev a stavů vozidel
export const LAYER_CFG = [
  {key: "showTrams", label: "Tramvaje", bg: "bg-[#fb8a00]"},
  {key: "showBuses", label: "Autobusy", bg: "bg-[#10a4ff]"},
  {key: "showTrolleys", label: "Trolejbusy", bg: "bg-[#22c55e]"},
  {key: "showStops", label: "Zobrazit zastávky", bg: "bg-purple-500"},
] as const

export const DEP_STATUS_CFG: Record<string, { label: string, color: string, bg: string }> = {
  "on-time": {label: "VČAS", color: "text-green-500", bg: "bg-green-500/15"},
  "alert": {label: "PORUCHA", color: "text-red-500", bg: "bg-red-500/15"},
  "delayed": {label: "ZPOŽDĚNÍ", color: "text-orange-500", bg: "bg-orange-500/15"}
}

export const DEP_T_HEAD = ["ID Jednotky", "Trasa / Cíl", "Aktuální stanice", "Plán", "Aktuální", "Status"]

export const createWaypointIcon = (color: string, index: number): L.DivIcon => {
  return L.divIcon({
    html: `<div style="width:24px;height:24px;border-radius:50%;background:white;border:3px solid ${color};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:${color};box-shadow:0 2px 4px rgba(0,0,0,0.1)">${index}</div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}