/*
Finalni revize - 100%
 */

import React, {useEffect, useState} from 'react'
import {IconButton} from '@mui/material'
import {useSimulationStore} from '../store/simulationStore'
import {calculateNextMetrics} from '../services/simulationService'
import {useAppStore} from '../store/appStore'
import {SimulationMap} from '../components/simulation/SimulationMap'
import {SimulationWizard} from '../components/simulation/SimulationWizard'
import {ConfirmButton} from '../components/dispatch/ui/ConfirmButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {PanelStatistics, PanelStopSearch} from "../components/simulation/SimulationPanel.tsx"

export const SimulationPage: React.FC = () => {
  const {network, fetchNetworkData} = useAppStore()
  const {
    isActive, setIsActive, metrics, setMetrics,
    weather, passengerLoad, disruptions,
    setMapInjectionMode, clearDisruptions
  } = useSimulationStore()

  const [isPanelOpen, setIsPanelOpen] = useState(true)

  useEffect(() => {
    if (network.stops.length === 0 && !network.isLoading) fetchNetworkData()
  }, [network.stops.length, network.isLoading, fetchNetworkData])

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      const next = calculateNextMetrics(metrics, {weather, passengerLoad, disruptions})
      setMetrics(next)
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive, metrics, weather, passengerLoad, disruptions, setMetrics])

  const handleReset = () => {
    setIsActive(false)
    setMapInjectionMode(false)
    clearDisruptions()
    setMetrics({congestion: 40, efficiency: 100, delay: 0})
  }

  return (
    <div className="h-full w-full bg-slate-100 flex overflow-hidden text-slate-900 relative">
      <aside
        className={`flex flex-col bg-white border-r border-slate-200 z-20 shadow-xl transition-all duration-300 overflow-hidden shrink-0 relative ${
          isPanelOpen ? 'w-95' : 'w-0 border-none'
        }`}
      >
        <div className="flex-1 overflow-y-auto min-w-95 bg-slate-50/50">
          {!isActive ? (
            <SimulationWizard/>
          ) : (
            <div className="p-6 space-y-8">
              <PanelStatistics metrics={metrics}/>
              <PanelStopSearch stops={network.stops} metricsDelay={metrics.delay} disruptions={disruptions}/>
            </div>
          )}
        </div>

        {isActive && (
          <div className="p-6">
            <ConfirmButton
              fullWidth
              colorScheme="error"
              textContent="Restart"
              handleConfirm={handleReset}
            />
          </div>
        )}
      </aside>

      <div
        className={`absolute top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${isPanelOpen ? 'left-91' : 'left-1'}`}
      >
        <IconButton
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          sx={{backgroundColor: 'white', color: 'primary', border: 1, "&:hover": {backgroundColor: 'white'}}}
          size="small"
        >
          {isPanelOpen ? <ChevronLeftIcon sx={{color: 'black'}}/> : <ChevronRightIcon sx={{color: 'black'}}/>}
        </IconButton>
      </div>

      <main className="flex-1 relative h-full bg-slate-100">
        <SimulationMap/>
      </main>

    </div>
  )
}