/*
Finalni revize - 100%
 */

import {InputAdornment, List, ListItem, ListItemText, TextField} from "@mui/material"
import type {Stop} from "../../types/transit.ts"
import SearchIcon from "@mui/icons-material/Search"
import {estimateStopDelay} from "../../services/simulationService.ts"
import {useState} from "react"
import TrafficIcon from "@mui/icons-material/Traffic"
import AssessmentIcon from "@mui/icons-material/Assessment"
import type {SimDisruption} from "../../types/simulation.ts"

export const PanelStatistics = ({metrics}: { metrics: any }) => (
  <div>
    <div className="flex items-center gap-2 mb-4 font-semibold tracking-tight">
      <AssessmentIcon fontSize="small" color="primary"/>
      <p className="font-sans tracking-normal">Statistika</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
        <span className="text-xs font-bold text-slate-500 block mb-1">Průjezdnost</span>
        <span className="text-2xl font-black text-blue-400 leading-none">{metrics.congestion.toFixed(0)}%</span>
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
        <span className="text-xs font-bold text-slate-500 block mb-1">Efektivita</span>
        <span className="text-2xl font-black text-blue-600 leading-none">{metrics.efficiency.toFixed(0)}%</span>
      </div>
      <div
        className="col-span-2 p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm">
        <span className="text-xs font-bold text-slate-500">Globální zpoždění</span>
        <span className="text-xl font-black text-red-500 leading-none">+{metrics.delay.toFixed(0)} min</span>
      </div>
    </div>
  </div>
)

export const PanelStopSearch = ({stops, metricsDelay, disruptions}: {
  stops: Stop[], metricsDelay: number, disruptions: SimDisruption[]
}) => {
  const [stopSearch, setStopSearch] = useState('')

  const filteredStops = stopSearch.trim()
    ? stops.filter(s => s.name.toLowerCase().includes(stopSearch.toLowerCase())).slice(0, 5)
    : []

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 font-semibold tracking-tight">
        <TrafficIcon fontSize="small" color="primary"/>
        <p className="font-sans tracking-normal">Lokální zpoždění</p>
      </div>
      <TextField
        fullWidth size="small" placeholder="Vyhledat zastávku..."
        value={stopSearch} onChange={(e) => setStopSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start"><SearchIcon className="text-slate-400"
                                                                         fontSize="small"/></InputAdornment>,
            className: "bg-white rounded-xl font-medium"
          }
        }}
        sx={{'& .MuiOutlinedInput-notchedOutline': {borderColor: '#e2e8f0'}}}
      />

      {filteredStops.length > 0 && (
        <List className="mt-3 space-y-2">
          {filteredStops.map(stop => {
            const lateTime = estimateStopDelay(stop.lat, stop.lng, metricsDelay, disruptions)
            const isDelayed = lateTime > 3

            return (
              <ListItem key={stop.id} className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                <ListItemText primary={stop.name} secondary={`ID: ${stop.gpsId || stop.id}`}/>
                <div
                  className={`flex items-center gap-1 font-semibold text-sm ${isDelayed ? 'text-red-600' : 'text-green-600'}`}>
                  {isDelayed ? `+${lateTime}` : '0'} m
                </div>
              </ListItem>
            )
          })}
        </List>
      )}
    </div>
  )
}
