/*
Finalni revize - 100%
 */

import {Box, Collapse, IconButton, Paper} from "@mui/material"
import {Close as CloseIcon} from "@mui/icons-material"
import {TransitionGroup} from 'react-transition-group'
import {TYPE_COLORS} from "../../../types/design.tsx"
import {useAppStore} from "../../../store/appStore.ts"

export const WaypointList = () => {
  const {removeWaypoint, routeConfig} = useAppStore()
  return (
    <Box className="space-y-4">
      <span className="text-sm text-slate-500 leading-none">Seznam zastávek ({routeConfig.waypoints.length})</span>

      <Box className="space-y-2 mt-2">
        <TransitionGroup component={null}>
          {routeConfig.waypoints.map((wp, i) => (
            <Collapse
              in
              key={wp.id}
              timeout={220}
              style={{transformOrigin: "0 0 0", transitionDelay: `${i * 45}ms`}}
            >
              <Paper
                elevation={0}
                className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3"
                sx={{
                  transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                    borderColor: "rgba(148, 163, 184, 0.55)",
                    backgroundColor: "rgba(248, 250, 252, 0.98)",
                  },
                }}
              >
                <Box
                  className={`w-7 h-7 bg-white border rounded-lg flex items-center justify-center font-black text-xs text-slate-600 shadow-sm shrink-0`}
                  sx={{transition: "transform 180ms ease", borderColor: TYPE_COLORS[wp.type]}}
                >
                  {String(i + 1)}
                </Box>
                <Box className="flex-1">
                  <p className="text-black font-semibold leading-tight">{wp.name}</p>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => removeWaypoint(wp.id)}
                  sx={{
                    color: "rgb(148, 163, 184)",
                    transition: "transform 180ms ease, color 180ms ease, background-color 180ms ease",
                    "&:hover": {
                      color: "rgb(220, 38, 38)",
                      backgroundColor: "rgba(220, 38, 38, 0.08)",
                      transform: "scale(1.08)",
                    },
                    "&:active": {
                      transform: "scale(0.96)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small"/>
                </IconButton>
              </Paper>
            </Collapse>
          ))}
        </TransitionGroup>

        {routeConfig.waypoints.length === 0 && (
          <Box className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <span className="text-xs text-slate-500 p-1">Kliknutím na zastávky na mapě vytvoříte trasu.</span>
          </Box>
        )}
      </Box>
    </Box>
  )
}
