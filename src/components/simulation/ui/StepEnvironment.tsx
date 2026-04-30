/*
Finalni revize - 100%
 */

import {Box, MenuItem, Select, Slider} from '@mui/material'
import CloudIcon from '@mui/icons-material/Cloud'
import GroupIcon from '@mui/icons-material/Group'
import {useSimulationStore} from '../../../store/simulationStore'
import {useState} from "react"
import {Weather} from "../../../types/design"

export const StepEnvironment = () => {
  const {weather, setWeather, passengerLoad, setPassengerLoad} = useSimulationStore()

  const [localValue, setLocalValue] = useState(passengerLoad)

  return (
    <Box className="space-y-10 mt-12">
      <Box className="p-5">
        <div className="flex items-center gap-2 mb-4 font-semibold tracking-tight">
          <CloudIcon fontSize="small" color="primary"/>
          <p className="font-sans tracking-normal">Počasí</p>
        </div>
        <Select fullWidth size="small" value={weather}
                onChange={(e) => setWeather(e.target.value as string)}
                className="bg-slate-100"
                sx={{'& .MuiOutlinedInput-notchedOutline': {border: 'none'}}}
        >
          {Weather.map(w => <MenuItem key={w.key} value={w.key} sx={{fontSize: 14}}>{w.label}</MenuItem>)}
        </Select>
      </Box>

      <Box className="p-5">
        <div className="flex items-center gap-2 mb-4 font-semibold tracking-tight">
          <GroupIcon fontSize="small" color="secondary"/>
          <p className="font-sans tracking-normal">Hustota dopravy</p>
        </div>

        <Slider
          value={localValue}
          onChange={(_, v) => setLocalValue(v as number)}
          onChangeCommitted={(_, v) => setPassengerLoad(v as number)}
          min={0}
          max={200}
          color="secondary"
        />
        <Box className="flex justify-between mt-1 text-[10px] font-semibold text-slate-400">
          <span>Nízká</span><span>Běžná</span><span>Vysoká</span>
        </Box>
      </Box>
    </Box>
  )
}