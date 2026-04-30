/*
Finalni revize - 100%
 */

import {Box, Step, StepLabel, Stepper, Typography} from '@mui/material'
import {useSimulationStore} from '../../store/simulationStore'
import {StepEnvironment} from './ui/StepEnvironment'
import {StepIncidents} from './ui/StepIncidents'
import {ConfirmButton} from "../dispatch/ui/ConfirmButton.tsx"
import React from "react"

const STEPS = ['Prostředí', 'Incidenty']

export const SimulationWizard: React.FC = () => {
  const {setupStep, setSetupStep, setIsActive, setMapInjectionMode} = useSimulationStore()
  const isLast = setupStep === STEPS.length - 1

  const handleLaunch = () => {
    setIsActive(true)
    setMapInjectionMode(true)
    setSetupStep(0)
  }

  const handleStepAdd = () => setSetupStep(setupStep + 1)
  const handleStepBack = () => setSetupStep(setupStep - 1)

  return (
    <Box className="h-full flex flex-col p-8 overflow-hidden">
      <Box className="mb-8 shrink-0">
        <Typography variant="h5" className="font-black text-slate-900 tracking-tight">Konfigurace</Typography>
        <Typography variant="body2" className="text-slate-500 font-medium">Nastavte parametry simulace.</Typography>
      </Box>

      <Stepper activeStep={setupStep} alternativeLabel className="mb-10 shrink-0">
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{'& .MuiStepLabel-label': {fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', mt: 1}}}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box className="flex-1 overflow-y-auto pr-2 min-h-0 pb-4">
        {setupStep === 0 && <StepEnvironment/>}
        {setupStep === 1 && <StepIncidents/>}

      </Box>

      <Box className="pt-8 flex justify-between gap-4 mt-auto shrink-0 border-t border-slate-100">
        <ConfirmButton handleConfirm={handleStepBack} textContent="Zpět" disabled={setupStep === 0}
                       colorScheme="error"/>
        {isLast ? (
          <ConfirmButton handleConfirm={handleLaunch} textContent="Spustit simulaci"/>
        ) : (
          <ConfirmButton handleConfirm={handleStepAdd} textContent="Pokračovat"/>
        )}
      </Box>
    </Box>
  )
}
