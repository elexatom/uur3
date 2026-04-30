/*
Finalni revize - 100%
 */

import React from 'react'
import {Box, IconButton, Typography} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'
import MapIcon from '@mui/icons-material/Map'
import type {Intervention} from "../../../types/dispatch.ts"

interface Props {
  intervention: Intervention;
  onRemove: () => void;
}

export const InterventionCard: React.FC<Props> = ({intervention, onRemove}) => {
  const isRepl = intervention.type === 'replacement'

  return (
    <Box className="p-4 border border-slate-200 rounded-lg relative group overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1"/>

      <div className="flex justify-between items-start mb-2 pl-2">
        <div className="flex items-center gap-2">
          {isRepl ? <WarningIcon className="text-orange-500" fontSize="small"/> :
            <MapIcon color="primary" fontSize="small"/>}
          <span className="font-bold text-slate-800">
            {intervention.title}
          </span>
        </div>
        <Typography variant="caption" className="text-slate-400 font-medium whitespace-nowrap">
          {intervention.timestamp}
        </Typography>
      </div>

      <Typography variant="body2" className="text-slate-600 pl-2 pr-8 leading-relaxed">
        {intervention.details}
      </Typography>

      <div className="absolute right-0 bottom-0">
        <IconButton
          size="small"
          onClick={onRemove}
        >
          <DeleteIcon fontSize="small"/>
        </IconButton>
      </div>
    </Box>
  )
}