// revidovano OK

import { Box, Button, TextField, Typography } from "@mui/material"
import { DeleteSweep as DeleteSweepIcon } from "@mui/icons-material"
import { useAppStore } from "../../store/appStore.ts"
import { VehicleSelector } from "./ui/VehicleSelector.tsx"
import type { TransitType } from "../../types/transit.ts"
import { WaypointList } from "./ui/WaypointList.tsx"

export default function EditorSidebar() {
  const {
    routeConfig, setRouteName, setRouteType, removeWaypoint,
    clearRoute, saveRouteToNetwork
  } = useAppStore()

  return (
    <Box className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-lg z-20">
      <Box className="p-6 flex-1 overflow-y-auto space-y-8">

        <Typography variant="h5" className="font-black tracking-tighter pb-8">Nová trasa</Typography>
        <Box className="space-y-4">
          <span className="text-sm text-slate-500 leading-none">Jméno trasy</span>
          <TextField
            size="small"
            className="bg-slate-50 rounded-xl font-semibold border-none"
            fullWidth placeholder="eg. Line X1 - Express..."
            value={routeConfig.name}
            onChange={(e) => setRouteName(e.target.value)}
            variant="outlined"
          />
        </Box>

        <VehicleSelector onSelect={(type: TransitType) => setRouteType(type)} routeType={routeConfig.type}/>
        <WaypointList routeConfig={routeConfig} removeWaypoint={removeWaypoint}/>
      </Box>

      <Box className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
        <Button
          fullWidth
          variant="outlined"
          onClick={clearRoute}
          startIcon={<DeleteSweepIcon/>}
          color="error" size="small"
          className="rounded-xl border-slate-200 text-slate-600 font-black text-xs"
          style={{ textTransform: "none" as const }}
        >
          Reset
        </Button>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={saveRouteToNetwork}
          disabled={!routeConfig.name || routeConfig.waypoints.length < 2}
          color="primary" size="small"
          className="rounded-xl font-semibold text-xs"
          style={{ textTransform: "none" as const }}
        >
          <span className="text-white">Uložit</span>
        </Button>
      </Box>
    </Box>
  )
}
