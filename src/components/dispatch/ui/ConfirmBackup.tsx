/** Dispatch **
 * Component pro potvrzeni vyslani zalohy
 */

/*
Finalni revize - 100%
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */

import {Box, Fade, Typography} from "@mui/material"
import React from "react"
import {ConfirmButton} from "./ConfirmButton.tsx"

interface ConfirmBackupProps {
  selectedUnit: string | null;
  targetStop: any | null;
  etaMinutes: number;
  handleConfirm: () => void;
}

export const ConfirmBackup: React.FC<ConfirmBackupProps> = (props) => {
  return (
    <Fade in={!!(props.selectedUnit && props.targetStop)}>
      <Box className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">

          <div className='ml-6'>
            <Typography variant="caption" className="text-slate-500 font-bold">
              Odhadovaný dojezd
            </Typography>
            <Typography variant="h5" className="font-black">
              {props.etaMinutes} min
            </Typography>
          </div>
        </div>
        <ConfirmButton handleConfirm={props.handleConfirm} textContent="Vyslat zálohu"/>
      </Box>
    </Fade>
  )
}