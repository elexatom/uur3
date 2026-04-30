/*
Finalni revize - 100%
 */

import React from "react"
import {FormControl, MenuItem, Select} from "@mui/material"
import {TileLayer} from "react-leaflet"
import type {SelectChangeEvent} from "@mui/material/Select"
import {useAppStore} from "../../store/appStore"
import MapIcon from "@mui/icons-material/Map"


export const BasemapTileLayer: React.FC = () => {
  const {settings} = useAppStore()
  const activeLayer = settings.basemapLayers.find(l => l.id === settings.activeBasemapId) || settings.basemapLayers[0]

  if (!activeLayer) return null

  return (
    <TileLayer
      key={activeLayer.id}
      url={activeLayer.url}
      attribution={activeLayer.attribution}
      maxZoom={19}
    />
  )
}

interface BasemapSelectorProps {
  className?: string;
}

export const BasemapSelector: React.FC<BasemapSelectorProps> = ({className}) => {
  const {settings, updateSettings} = useAppStore()

  const handleChange = (event: SelectChangeEvent<string>) => {
    updateSettings({activeBasemapId: event.target.value})
  }

  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20 min-w-50 ${className || ''}`}>
      <header className="flex items-center gap-2 mb-3">
        <MapIcon color='primary' fontSize="small"/>
        <span className="text-[13px] font-semibold tracking-wide text-black">
          Mapový podklad
        </span>
      </header>

      <FormControl fullWidth size="small">
        <Select
          value={settings.activeBasemapId}
          onChange={handleChange}
          sx={{backgroundColor: "#fff", fontSize: 12, fontWeight: 600}}
        >
          {settings.basemapLayers.map((layer) => (
            <MenuItem key={layer.id} value={layer.id} sx={{fontSize: 12}}
                      className="font-medium text-slate-700">
              {layer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}