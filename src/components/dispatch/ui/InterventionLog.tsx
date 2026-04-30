/*
Finalni revize - 100%
 */

import type {Intervention} from "../../../types/dispatch.ts"
import {Chip, Typography} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import {InterventionCard} from "./InterventionCard.tsx"

export const InterventionLog = ({items, onRemove}: { items: Intervention[], onRemove: (id: string) => void }) => {
  return (
    <div
      className="lg:col-span-4 flex flex-col h-full rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
        <p className="font-semibold tracking-tight text-slate-600">Aktivní opatření</p>
        <Chip label={items.length} size="small" className="font-bold"/>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <CheckCircleIcon sx={{fontSize: 64, mb: 2}}/>
            <Typography className="font-medium">Vše běží podle plánu</Typography>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <InterventionCard key={item.id} intervention={item} onRemove={() => onRemove(item.id)}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}