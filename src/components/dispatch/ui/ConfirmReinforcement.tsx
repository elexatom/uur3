/** Dispatch **
 * Component pro potvrzeni posileni vozidel a ridicu pro krizovou situaci.
 * Zobrazuje se pouze pokud je vybrana cilova oblast pro posileni.
 */

/*
Finalni revize - 100%
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */

import {Box, Fade} from "@mui/material"
import React from "react"
import {ConfirmButton} from "./ConfirmButton.tsx"

interface ConfirmReinforcementProps {
  targetArea: any;
  extra: { vehicles: number; drivers: number };
  handleConfirm: () => void;
}

export const ConfirmReinforcement: React.FC<ConfirmReinforcementProps> = (props) => {
  return (
    <Fade in={!!props.targetArea}>
      <Box className="mt-auto pt-6 border-t border-slate-200 flex justify-between items-center">
          <span className="text-slate-500 text-sm">
            Požadavek: <strong className="text-slate-800">+{props.extra.vehicles} vozů</strong> | <strong
            className="text-slate-800">+{props.extra.drivers} řidičů</strong>
          </span>
        <ConfirmButton handleConfirm={props.handleConfirm} textContent="Schválit plán"/>
      </Box>
    </Fade>
  )
}