// revidovano OK

import LayersIcon from "@mui/icons-material/Layers"
import { LAYER_CFG } from "../../../types/design.tsx"
import { Switch } from "@mui/material"
import { useAppStore } from "../../../store/appStore.ts"

export const LayerSwitcher = () => {
  const { layers, toggleLayer } = useAppStore()

  return (
    <div
      className="absolute z-1000 top-3 right-3 min-w-60 bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20">
      <header className="flex items-center gap-2 mb-4">
        <LayersIcon className="text-blue-400" fontSize="small"/>
        <span className="uppercase text-[11px] font-black tracking-widest text-gray-800">Vrstvy mapy</span>
      </header>
      {LAYER_CFG.map(({ key, label, bg }) => (
        <div key={key} className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${bg}`}/>
            <span className="text-xs text-gray-600 font-medium">{label}</span>
          </div>
          <Switch size="small" checked={layers[key]} onChange={() => toggleLayer(key)}/>
        </div>
      ))}
    </div>
  )
}