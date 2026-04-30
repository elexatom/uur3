/*
Finalni revize - 100%
 */

import React, {useEffect, useMemo, useState} from 'react'
import {Autocomplete, Chip, TextField, Typography} from '@mui/material'
import {DataGrid, type GridColDef} from '@mui/x-data-grid'
import {useAppStore} from '../../store/appStore'
import type {Intervention} from '../../types/dispatch'
import {ConfirmBackup} from "./ui/ConfirmBackup.tsx"
import type {Stop} from "../../types/transit.ts"
import {units} from "../../types/mockUnits.ts"

interface Props {
  onComplete: (i: Intervention) => void;
}

export const ReplacementWizard: React.FC<Props> = ({onComplete}) => {
  const {network, fetchNetworkData} = useAppStore()

  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [targetStop, setTargetStop] = useState<Stop | null>(null)

  useEffect(() => {
    if (network.stops.length === 0 && !network.isLoading) {
      fetchNetworkData()
    }
  }, [network.stops.length, network.isLoading, fetchNetworkData])


  const etaMinutes = useMemo(() => {
    if (!selectedUnit || !targetStop) return 0
    return 4 + ((targetStop.name || "").length % 12)
  }, [selectedUnit, targetStop])

  const columns: GridColDef[] = [
    {field: 'id', headerName: 'Vůz', flex: 1},
    {field: 'line', headerName: 'Linka', flex: 1},
    {field: 'currentStation', headerName: 'Pozice', flex: 2},
    {
      field: 'maintenanceStatus',
      headerName: 'Stav',
      flex: 1,
      renderCell: (p) => {
        const isOptimal = p.value === 'optimální'
        return (
          <Chip
            label={p.value}
            size="small"
            sx={{
              backgroundColor: isOptimal ? '#d1fae5' : '#fee2e2',
              color: isOptimal ? '#065f46' : '#991b1b',
              fontWeight: isOptimal ? '500' : '700',
            }}
          />
        )
      }
    },
  ]

  const handleConfirm = () => {
    if (!targetStop) return
    onComplete({
      id: `INT-${Date.now()}`,
      type: 'replacement',
      title: `Náhrada vozu ${selectedUnit}`,
      timestamp: new Date().toLocaleTimeString(),
      details: `Nasazena operativní záloha. Převzetí spoje v zastávce ${targetStop.name} (ETA: ${etaMinutes} min).`,
    })
    setSelectedUnit(null)
    setTargetStop(null)
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <section>
        <h3 className="mb-2 font-semibold font-sans text-slate-500">Vyberte vůz, který bude nahrazen a poté zastávku,
          kde dojde k výměně</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" style={{height: 400}}>
          <DataGrid
            rows={units}
            columns={columns}
            onRowClick={(params) => setSelectedUnit(params.row.id as string)}
            disableRowSelectionOnClick={true}
            getRowClassName={(params) => params.row.id === selectedUnit ? 'bg-blue-50 text-blue-800 font-bold' : ''}
            density="compact"
            hideFooter
            disableColumnMenu
            sx={{
              '& .MuiDataGrid-row': {cursor: 'pointer', transition: 'all 0.2s'},
              '& .MuiDataGrid-row:hover': {backgroundColor: '#f1f5f9'}
            }}
          />
        </div>
      </section>

      <section
        className={`transition-all duration-500 ${selectedUnit ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <Autocomplete
          size="small"
          options={network.stops || []}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={targetStop}
          onChange={(_, newValue) => setTargetStop(newValue)}
          loading={network.isLoading}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <Typography variant="body2">{option.name}</Typography>
              <Typography variant="caption" className="text-slate-400 ml-2">
                &nbsp;({option.gpsId || option.id})
              </Typography>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={network.isLoading ? "Načítám zastávky..." : "Vyhledat zastávku pro převzetí spoje..."}
              variant="standard"
              size="small"
              color="primary"
              className="bg-transparent"
            />
          )}
        />
      </section>

      <ConfirmBackup
        handleConfirm={handleConfirm}
        selectedUnit={selectedUnit}
        targetStop={targetStop}
        etaMinutes={etaMinutes}
      />
    </div>
  )
}