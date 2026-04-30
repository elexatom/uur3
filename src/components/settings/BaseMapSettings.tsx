/*
Finalni revize - 100%
 */

import {IconButton, MenuItem, TextField} from "@mui/material"
import {useAppStore} from "../../store/appStore.ts"
import type {BasemapLayerConfig} from "../../types/transit.ts"
import DeleteIcon from "@mui/icons-material/Delete"

export const BaseMapSettings = () => {
  const {settings, updateSettings} = useAppStore()

  const handleLayerChange = (id: string, field: keyof BasemapLayerConfig, value: string) => {
    const nextLayers = settings.basemapLayers.map(layer =>
      layer.id === id ? {...layer, [field]: value} : layer
    )
    updateSettings({basemapLayers: nextLayers})
  }

  const handleBasemapRemove = (id: string) => {
    if (settings.basemapLayers.length <= 1) return
    const nextLayers = settings.basemapLayers.filter(l => l.id !== id)
    updateSettings({
      basemapLayers: nextLayers,
      activeBasemapId: settings.activeBasemapId === id ? nextLayers[0].id : settings.activeBasemapId
    })
  }

  return (
    <div className="space-y-6">
      <div className="w-full md:w-72">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
          Výchozí podklad
        </label>
        <TextField
          select
          fullWidth
          size="small"
          value={settings.activeBasemapId}
          onChange={(e) => updateSettings({activeBasemapId: e.target.value})}
          className="bg-slate-50"
          sx={{'& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
        >
          {settings.basemapLayers.map((layer, idx) => (
            <MenuItem key={layer.id} value={layer.id} className="text-sm font-medium">
              {layer.name || `Vrstva ${idx + 1}`}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="space-y-3 mt-4">
        {settings.basemapLayers.map((layer) => (
          <div key={layer.id}
               className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-start focus-within:border-blue-400 focus-within:bg-blue-50/30 transition-colors">

            {/* Název */}
            <div className="md:col-span-3">
              <TextField
                fullWidth size="small" label="Název"
                value={layer.name || ''}
                onChange={(e) => handleLayerChange(layer.id, 'name', e.target.value)}
                className="bg-white"
                sx={{'& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
              />
            </div>

            {/* URL */}
            <div className="md:col-span-5">
              <TextField
                fullWidth size="small" label="Tile URL"
                value={layer.url}
                onChange={(e) => handleLayerChange(layer.id, 'url', e.target.value)}
                className="bg-white"
                sx={{'& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
              />
            </div>

            {/* Atribuce */}
            <div className="md:col-span-3">
              <TextField
                fullWidth size="small" label="Attribution"
                value={layer.attribution}
                onChange={(e) => handleLayerChange(layer.id, 'attribution', e.target.value)}
                className="bg-white"
                sx={{'& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
              />
            </div>

            {/* Smazání */}
            <div className="md:col-span-1 flex justify-end mt-1">
              <IconButton
                color="error"
                onClick={() => handleBasemapRemove(layer.id)}
                disabled={settings.basemapLayers.length <= 1}
                className="disabled:opacity-30"
              >
                <DeleteIcon/>
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}