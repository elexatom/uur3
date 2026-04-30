/*
Finalni revize - 100%
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */


import React, {useState} from 'react'
import {Autocomplete, Box, CircularProgress, InputAdornment, TextField, Typography} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import type {Intervention} from '../../types/dispatch'
import {useLocationSearch} from "../../services/useLocationSearch.ts"
import {useFleetCalc} from "../../services/useFleetCalc.ts"
import ReinforcementSettings from "./ui/ReinforcementSettings.tsx"
import {ConfirmReinforcement} from "./ui/ConfirmReinforcement.tsx"

export const ReinforcementWizard: React.FC<{ onComplete: (i: Intervention) => void; }> = ({onComplete}) => {
  const [inputValue, setInputValue] = useState('')
  const [targetArea, setTargetArea] = useState<any | null>(null)
  const [people, setPeople] = useState(5000)
  const [freqMin, setFreqMin] = useState(5)
  const [open, setOpen] = useState(false)

  const {results, loading} = useLocationSearch(inputValue)
  const {extra, chartData} = useFleetCalc(people, freqMin)

  const handleConfirm = () => {
    if (!targetArea) return
    onComplete({
      id: `REI-${Date.now()}`,
      type: 'reinforcement',
      title: `Posila: ${targetArea.main}`,
      timestamp: new Date().toLocaleTimeString(),
      details: `Nasazeno +${extra.vehicles} vozů, +${extra.drivers} řidičů. Frekvence: ${freqMin} min.`,
    })

    setTargetArea(null)
    setInputValue('')
    setPeople(5000)
    setFreqMin(5)
  }

  return (
    <div className="flex flex-col h-full gap-8">
      <section>
        <h3 className="mb-2 text-slate-500 font-sans font-semibold">1. Místo konání akce</h3>
        <Autocomplete
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={inputValue.trim() ? results : targetArea ? [targetArea] : []}
          getOptionLabel={(o) => o.main ?? ''}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          filterOptions={(x) => x}
          value={targetArea}
          onChange={(_, v) => setTargetArea(v)}
          onInputChange={(_, v) => setInputValue(v)}
          loading={loading}
          renderOption={(props, o) => (
            <li {...props} key={o.id}>
              <Box className="flex items-center gap-3 py-1">
                <LocationOnIcon color="primary" fontSize="small"/>
                <Box>
                  <Typography variant="body2" className="font-bold">{o.main}</Typography>
                  {o.detail && <p className="text-slate-500 font-mono text-sm">{o.detail}</p>}
                </Box>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Zadejte název místa v Plzni..."
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  startAdornment: (
                    <>
                      <InputAdornment position="start" className="pl-2">
                        <SearchIcon className="text-slate-400"/>
                      </InputAdornment>
                      {params.slotProps?.input?.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {loading && <CircularProgress size={20}/>}
                      {params.slotProps?.input?.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
        />
      </section>

      <ReinforcementSettings
        people={people}
        setPeople={setPeople}
        freqMin={freqMin}
        setFreqMin={setFreqMin}
        chartData={chartData}
        targetArea={targetArea}
      />

      <ConfirmReinforcement
        handleConfirm={handleConfirm}
        extra={extra}
        targetArea={targetArea}
      />
    </div>
  )
}