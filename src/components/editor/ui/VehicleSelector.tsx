/*
Finalni revize - 100%
 */

import { Box, Button } from "@mui/material"
import Grid from "@mui/material/Grid"
import { TYPE_COLORS, TYPE_ICONS } from "../../../types/design.tsx"
import React from "react"
import type { TransitType } from "../../../types/transit.ts"

interface VehicleSelectorProps {
  onSelect: (type: TransitType) => void;
  routeType: TransitType;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ onSelect, routeType }) => (
  <Box className="space-y-4">
    <span className="text-sm text-slate-500 leading-none">Typ vozidla</span>
    <Grid container spacing={1} className="mt-1">
      {(["tram", "bus", "trolley"] as const).map((t) => (
        <Grid size={4} key={t}>
          <Button
            fullWidth
            onClick={() => onSelect(t)}
            variant="outlined"
            size="small"
            disableElevation
            className={`flex-col py-1.5 rounded-xl transition-all ${
              routeType === t ? "" : "grayscale opacity-60"
            }`}
            style={routeType === t ? {
              borderColor: TYPE_COLORS[t],
              textTransform: "none" as const
            } : { textTransform: "none" as const }}
          >
            <div className="flex items-center gap-0.5">
              <span style={{ color: TYPE_COLORS[t] }}>{TYPE_ICONS[t]}</span>
              <p
                style={{ color: TYPE_COLORS[t] }}
                className={`text-[12px] font-semibold mt-1`}
              >
                {t === "bus" ? "Bus" : (t === "trolley" ? "Trolejbus" : "Tramvaj")}
              </p>
            </div>
          </Button>
        </Grid>
      ))}
    </Grid>
  </Box>
)