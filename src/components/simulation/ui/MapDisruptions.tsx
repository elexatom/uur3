/*
Finalni revize - 100%
 */

import {SEVERITY_CONFIG} from "../../../types/design"
import {Circle, Popup} from "react-leaflet"
import {Box, MenuItem, Select} from "@mui/material"
import {ConfirmButton} from "../../dispatch/ui/ConfirmButton.tsx"
import React from "react"
import type {SimDisruption} from "../../../types/simulation"
import {useSimulationStore} from "../../../store/simulationStore"

type SeverityKey = keyof typeof SEVERITY_CONFIG;

interface MapDisruptionsProps {
  disruptions: SimDisruption[];
}

export const MapDisruptions: React.FC<MapDisruptionsProps> = (props) => {
  const {removeDisruption, updateDisruption} = useSimulationStore()

  return (
    props.disruptions.map((d) => {
      const config = SEVERITY_CONFIG[d.severity as SeverityKey] || SEVERITY_CONFIG[0]

      return (
        <Circle
          key={d.id}
          center={[d.lat, d.lng]}
          radius={d.radius}
          pathOptions={{
            color: config.color,
            fillColor: config.color,
            fillOpacity: 0.25,
            weight: 2,
            dashArray: '4, 6'
          }}
        >
          <Popup>
            <Box className="flex flex-col gap-3">
              <p className="font-semibold text-slate-600 font-sans">
                Zvolte závažnost události
              </p>

              <Select
                fullWidth
                size="small"
                value={d.severity}
                onChange={(e) => updateDisruption(d.id, {
                  severity: e.target.value as SeverityKey,
                  severityLabel: SEVERITY_CONFIG[e.target.value as SeverityKey].label
                })}
                className="bg-slate-50 rounded-lg"
                sx={{fontSize: '0.75rem'}}
              >
                {(Object.entries(SEVERITY_CONFIG) as [string, { label: string }][]).map(([key, conf]) => (
                  <MenuItem key={key} value={Number(key)} sx={{fontSize: '0.75rem'}}>
                    {conf.label}
                  </MenuItem>
                ))}
              </Select>

              <ConfirmButton
                colorScheme="error"
                textContent="Odstranit událost"
                handleConfirm={() => removeDisruption(d.id)}
              />
            </Box>
          </Popup>
        </Circle>
      )
    })
  )
}
