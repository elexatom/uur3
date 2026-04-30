/*
Finalni revize - 100%
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */

import {Box, Paper, Slider, Typography} from "@mui/material"
import SpeedIcon from "@mui/icons-material/Speed"
import PeopleIcon from "@mui/icons-material/People"
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

const TooltipContent = ({active, payload, label}: any) =>
  active && payload?.length ? (
    <Paper elevation={3} className="p-3 rounded-xl border border-slate-100">
      <Typography variant="subtitle2" className="font-bold text-slate-800 mb-1">{label}</Typography>
      {payload.map((e: any, i: number) => (
        <Typography key={i} variant="body2" style={{color: e.color}} className="font-medium">
          {e.name}: {e.value}
        </Typography>
      ))}
    </Paper>
  ) : null

interface ReinforcementSettingsProps {
  people: number
  setPeople: (v: number) => void
  freqMin: number
  setFreqMin: (v: number) => void
  chartData: { name: string, vozy: number, ridici: number }[]
  targetArea: string | null
}

export default function ReinforcementSettings(props: ReinforcementSettingsProps) {
  return (
    <section
      className={`transition-opacity duration-300 flex flex-col lg:flex-row gap-6 ${props.targetArea ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
      <Box className="flex-1 flex flex-col">
        <h3 className="mb-2 font-semibold font-sans text-slate-500">2. Parametry</h3>
        <Box className="flex-1 p-6 rounded-xl border bg-white border-slate-200 flex flex-col justify-center gap-8">
          <Box>
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="font-bold flex items-center gap-2 text-slate-600">
                <PeopleIcon color="primary"/> Očekávaný dav
              </Typography>
              <Typography variant="h6" color="primary">{props.people.toLocaleString()}</Typography>
            </Box>
            <Slider value={props.people} min={500} max={30000} step={500}
                    onChange={(_, v) => props.setPeople(v)} sx={{color: "primary"}}/>
          </Box>

          <Box>
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="font-bold flex items-center gap-2 text-slate-600">
                <SpeedIcon color="secondary"/> Frekvence spojů
              </Typography>
              <Typography variant="h6" color="secondary">{props.freqMin} min</Typography>
            </Box>
            <Slider value={props.freqMin} min={1} max={15} step={1} marks
                    onChange={(_, v) => props.setFreqMin(v)} sx={{color: "secondary.main"}}/>
          </Box>
        </Box>
      </Box>

      <Box className="flex-1 flex flex-col">
        <h3 className="mb-2 font-semibold font-sans text-slate-500">3. Nároky na flotilu</h3>
        <Box className="flex-1 min-h-80 p-4 rounded-xl border border-slate-200 bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={props.chartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} axisLine={false}
                     tickLine={false}/>
              <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TooltipContent/>} cursor={{fill: '#f8fafc'}}/>
              <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
              <Bar dataKey="vozy" name="Vozy" radius={[4, 4, 0, 0]} barSize={40} fill="#8b5cf6"/>
              <Bar dataKey="ridici" name="Řidiči" radius={[4, 4, 0, 0]} barSize={40} fill="#f59e0b"/>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

    </section>
  )
}