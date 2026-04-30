/*
Finalni revize - 100%
 */

import {useState} from 'react'
import {Box, CircularProgress, IconButton, InputAdornment, List, ListItem, ListItemText, TextField} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import WarningIcon from '@mui/icons-material/Warning'
import {useSimulationStore} from '../../../store/simulationStore'
import {useLocationSearch} from '../../../services/useLocationSearch'
import type {FormatedFeature} from "../../../types/network.ts"

export const StepIncidents = () => {
  const {addDisruption} = useSimulationStore()
  const [query, setQuery] = useState('')

  const {results, loading} = useLocationSearch(query)

  const handleSelect = (res: FormatedFeature) => {
    addDisruption({
      lat: parseFloat(res.lat),
      lng: parseFloat(res.lon),
      label: res.main,
      severity: 1,
      severityLabel: "Střední",
      radius: 350,
    })

    setQuery('')
  }

  return (
    <Box className="flex flex-col gap-4 h-full min-h-0">
      <div className="flex items-center gap-2 font-semibold tracking-tight mt-12">
        <WarningIcon color="error"/>
        <p className="font-sans tracking-normal">Místa problému</p>
      </div>

      <TextField
        fullWidth placeholder="např. CAN, Náměstí..."
        value={query}
        size="small"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && setQuery(query)}
        slotProps={{
          input: {
            className: 'bg-slate-100 rounded-2xl border-none',
            sx: {'& .MuiOutlinedInput-notchedOutline': {border: 'none'}},
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setQuery(query)} disabled={loading} size="small"
                            className="bg-blue-600 text-white hover:bg-blue-700 p-1.5">
                  {loading
                    ? <CircularProgress size={16} color="inherit"/>
                    : <SearchIcon sx={{fontSize: 16}}/>}
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
        className="shrink-0"
      />

      <Box className="flex-1 overflow-y-auto bg-slate-50 rounded-md min-h-40">
        {results.length > 0 ? (
          <List>
            {!loading && results.map((res) => (
              <ListItem key={res.id} className="hover:bg-slate-100 transition-colors text-sm cursor-pointer"
                        onClick={() => handleSelect(res)}>
                <ListItemText
                  primary={res.main}
                  secondary={res.detail}
                  sx={{'& .MuiListItemText-primary': {fontWeight: 600}, '& .MuiListItemText-secondary': {fontSize: 12}}}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box className="p-8 text-center text-slate-400">
            <p className="text-sm opacity-60">Hledejte místa v Plzni</p>
          </Box>
        )}
      </Box>
    </Box>
  )
}