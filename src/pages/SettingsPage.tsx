/*
Finalni revize - 100%
 */

import React from 'react'
import {TextField} from '@mui/material'
import CloudSyncIcon from '@mui/icons-material/CloudSync'
import LayersIcon from '@mui/icons-material/Layers'
import AddIcon from '@mui/icons-material/Add'
import {useAppStore} from '../store/appStore'
import type {BasemapLayerConfig} from '../types/transit.ts'
import {BaseMapSettings} from "../components/settings/BaseMapSettings.tsx"

export const SettingsPage: React.FC = () => {
  const {settings, updateSettings} = useAppStore()

  const handleBasemapAdd = () => {
    const newLayer: BasemapLayerConfig = {
      id: `custom-${crypto.randomUUID()}`,
      name: 'Nová vrstva',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap',
    }
    updateSettings({
      basemapLayers: [...settings.basemapLayers, newLayer],
      activeBasemapId: newLayer.id
    })
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 text-slate-900 p-6 md:p-8">
      <div className="max-w-275 mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight mb-1">Nastavení aplikace</h1>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-slate-500 text-sm font-medium">
              Změny se ukládají a aplikují automaticky.
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <CloudSyncIcon className="absolute -top-5 -right-5 text-[160px] text-slate-100"/>
          <h2 className="flex items-center gap-2 text-lg font-bold mb-6">
            <CloudSyncIcon color='primary'/> OSRM Engine
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Směrovací server (Endpoint)
              </label>
              <TextField
                fullWidth
                size="small"
                value={settings.osrmEndpoint}
                onChange={(e) => updateSettings({osrmEndpoint: e.target.value})}
                className="bg-slate-50"
                sx={{'& .MuiOutlinedInput-root': {borderRadius: '8px'}}}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <LayersIcon color="primary"/> Mapové podklady
              </h2>
              <p className="text-xs text-slate-500 mt-1">Konfigurace zdrojových dlaždic a autorských práv pro mapy.</p>
            </div>
            <button
              onClick={handleBasemapAdd}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <AddIcon fontSize="small"/>
              Přidat vrstvu
            </button>
          </div>

          <BaseMapSettings/>
        </div>
      </div>
    </div>
  )
}